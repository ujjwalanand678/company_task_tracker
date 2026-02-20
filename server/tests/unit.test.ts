import { hashPassword, comparePassword, generateToken } from '../src/utils/auth';

describe('Authentication Utilities (Unit Tests)', () => {
    
    it('should hash a password and return a string different from the input', async () => {
        const password = 'plainPassword123';
        const hashedPassword = await hashPassword(password);
        expect(hashedPassword).toBeDefined();
        expect(hashedPassword).not.toBe(password);
        expect(hashedPassword.length).toBeGreaterThan(20);
    });

    it('should successfully compare a password with its hash', async () => {
        const password = 'plainPassword123';
        const hashedPassword = await hashPassword(password);
        const isMatch = await comparePassword(password, hashedPassword);
        expect(isMatch).toBe(true);
    });

    it('should fail comparing a wrong password with a hash', async () => {
        const password = 'plainPassword123';
        const hashedPassword = await hashPassword(password);
        const isMatch = await comparePassword('wrongPassword', hashedPassword);
        expect(isMatch).toBe(false);
    });

    it('should generate a JWT token string', () => {
        const payload = { userId: 1, email: 'test@example.com', role: 'user' };
        const token = generateToken(payload);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.split('.').length).toBe(3); // Standard JWT format
    });
});
