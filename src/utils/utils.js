import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function generateToken(user) {
    const token = jwt.sign({ data: user }, process.env.PRIVATE_KEY, { expiresIn: '24h' });
    return token;
}  