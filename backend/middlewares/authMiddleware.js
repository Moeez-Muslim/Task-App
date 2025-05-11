exports.requireAuth = (req, res, next) => {
    const userId = req.cookies.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = userId;
    next();
};
