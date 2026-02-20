import { Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../types';
import { z } from 'zod';

const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(['pending', 'completed']).optional()
});

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status } = taskSchema.parse(req.body);
        const userId = req.user!.userId;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'pending',
                userId
            }
        });

        res.status(201).json(task);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.issues });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const { userId, role } = req.user!;

        let tasks;
        if (role === 'admin') {
            tasks = await prisma.task.findMany({
                include: { user: { select: { email: true } } }
            });
        } else {
            tasks = await prisma.task.findMany({
                where: { userId }
            });
        }

        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, status } = taskSchema.partial().parse(req.body);
        const { userId, role } = req.user!;

        const task = await prisma.task.findUnique({ where: { id: Number(id) } });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (role !== 'admin' && task.userId !== userId) {
            return res.status(403).json({ message: 'Access denied. You can only update your own tasks.' });
        }

        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data: { title, description, status }
        });

        res.json(updatedTask);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.issues });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.user!;

        const task = await prisma.task.findUnique({ where: { id: Number(id) } });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (role !== 'admin' && task.userId !== userId) {
            return res.status(403).json({ message: 'Access denied. You can only delete your own tasks.' });
        }

        await prisma.task.delete({ where: { id: Number(id) } });

        res.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
