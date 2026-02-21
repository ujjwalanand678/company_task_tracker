import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'user']).optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists', message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'user'
            }
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', message: error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') });
        }
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password', message: 'Invalid email or password' });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password', message: 'Invalid email or password' });
        }

        const token = generateToken({ userId: user.id, role: user.role });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', message: error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') });
        }
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};
