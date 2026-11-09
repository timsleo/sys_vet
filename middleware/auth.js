import jwt from 'jsonwebtoken';

// Middleware de autenticação por JWT.
// Uso: app.get('/rota', authenticate(), handler)
// Com restrição de perfil: app.get('/rota', authenticate(['ADMIN']), handler)
const authenticate = (roles = []) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso não autorizado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Permissão negada' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

export default authenticate;
