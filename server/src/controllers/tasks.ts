import { Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../types';
import { z } from 'zod';

const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    assignedUserIds: z.array(z.number()).min(1, "At least one user must be assigned")
});

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { role } = req.user!;
        if (role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can create tasks.' });
        }

        const { title, description, assignedUserIds } = taskSchema.parse(req.body);

        const task = await prisma.task.create({
            data: {
                title,
                description,
                creatorId: req.user!.userId,
                assignments: {
                    create: assignedUserIds.map(userId => ({
                        userId
                    }))
                }
            },
            include: {
                creator: { select: { name: true } },
                assignments: {
                    include: { user: { select: { email: true, name: true } } }
                }
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

        if (role === 'admin') {
            const tasks = await prisma.task.findMany({
                include: { 
                    creator: { select: { name: true } },
                    assignments: { 
                        include: { user: { select: { email: true, name: true } } } 
                    } 
                },
                orderBy: { created_at: 'desc' }
            });
            return res.json(tasks);
        } else {
            // For regular users, we return their specific assignments with task details
            const assignments = await prisma.taskAssignment.findMany({
                where: { userId },
                include: { 
                    task: {
                        include: { creator: { select: { name: true } } }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            
            // Map to a format the frontend expects (or adjust frontend)
            // Let's return the task object with an additional 'userStatus' field
            const tasks = assignments.map(a => ({
                ...a.task,
                status: a.status, // Individual status
                assignmentId: a.id
            }));
            
            return res.json(tasks);
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.user!;
        const { title, description, status } = z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            status: z.enum(['pending', 'completed']).optional()
        }).parse(req.body);

        if (role === 'admin') {
            const updatedTask = await prisma.task.update({
                where: { id: Number(id) },
                data: { title, description },
                include: {
                    creator: { select: { name: true } },
                    assignments: {
                        include: { user: { select: { email: true, name: true } } }
                    }
                }
            });
            return res.json(updatedTask);
        } else {
            // Regular user updates their assignment status
            // The 'id' in the URL for a user might be the Task ID, but they update the Assignment
            const assignment = await prisma.taskAssignment.findFirst({
                where: { taskId: Number(id), userId }
            });

            if (!assignment) {
                return res.status(404).json({ message: 'Assignment not found' });
            }

            const updatedAssignment = await prisma.taskAssignment.update({
                where: { id: assignment.id },
                data: { status: status || 'pending' }
            });

            return res.json(updatedAssignment);
        }
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

        if (role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can delete tasks.' });
        }

        await prisma.task.delete({ where: { id: Number(id) } });

        res.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
