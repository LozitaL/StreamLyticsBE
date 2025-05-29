import jwt from 'jsonwebtoken';

const SECRET = '@abc1234567890!@#$%^&*()_+'; 

export function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

export function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
}