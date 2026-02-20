import request from 'supertest';
import app from '../src/index';

describe('API Integration Tests', () => {
    
    describe('Health Check', () => {
        it('should return 200 and status ok', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'ok');
        });
    });

    describe('Authentication (Register Validation)', () => {
        it('should return 400 for invalid registration data', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'not-an-email',
                    password: '123' // too short
                });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation error');
        });
    });

    describe('Authorization', () => {
        it('should return 401 for protected routes without token', async () => {
            const response = await request(app).get('/tasks');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Access denied. No token provided.');
        });
    });

    afterAll(async () => {
        const prisma = (await import('../src/services/prisma')).default;
        await prisma.$disconnect();
    });

});
