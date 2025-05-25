const jwt = require("jsonwebtoken");
const Members = require("../models/Members");

class AuthenticationController {
    async authenticate(req, res) {
        try {
            const { email, password } = req.body;

            const member = await Members.findOne({
                where: { email },
            });

            if (!member) {
                return res.status(401).json({ error: "Member not found!" });
            }

            if (!await member.checkPassword(password)) {
                return res.status(401).json({ message: "Password doesn't match!" });
            }

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                return res.status(500).json({ error: "JWT secret is not configured." });
            }

            const token = jwt.sign(
                { email: member.email },  // Apenas o email no payload
                secret,
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                message: "User authenticated successfully!",
                token
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao realizar login.", details: error.message });
        }
    }
}

module.exports = new AuthenticationController();
