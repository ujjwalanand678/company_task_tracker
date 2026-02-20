import { Request } from 'express';

export interface UserPayload {
    userId: number;
    email?: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}
