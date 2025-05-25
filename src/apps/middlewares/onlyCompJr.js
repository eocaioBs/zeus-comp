module.exports = (req, res, next) => {
    if (!req.user || !req.user.email.endsWith("@compjunior.com.br")) {
        return res.status(403).json({ message: "Apenas membros da CompJunior podem acessar esta funcionalidade." });
    }
    next();
};