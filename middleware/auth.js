const authenticate = (roles = []) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso não autorizado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Permissão negada' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};
