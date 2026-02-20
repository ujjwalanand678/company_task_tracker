import { Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../types';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, role: true }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true }
        });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (Number(id) === req.user?.userId) {
            return res.status(400).json({ message: 'Admins cannot delete themselves.' });
        }

        await prisma.user.delete({ where: { id: Number(id) } });

        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
