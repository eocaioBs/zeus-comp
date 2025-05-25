const Members = require("../models/Members");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

class MemberController {
    async setup(req, res) {
        try {
            const count = await Members.count();

            if (count > 0) {
                return res.status(403).json({ message: "Já existe um administrador cadastrado." });
            }

            const {
                full_name,
                birth_date,
                email,
                role,
                phone,
                gender,
                egress,
                skills,
                password
            } = req.body;

            if (!password || password.length < 6) {
                return res.status(400).json({ message: "Senha deve conter no mínimo 6 caracteres." });
            }

            const password_hash = await bcrypt.hash(password, 8);

            let parsedSkills = [];
            if (Array.isArray(skills)) parsedSkills = skills;
            else if (skills) {
                try {
                    parsedSkills = JSON.parse(skills);
                } catch (e) {
                    return res.status(400).json({ message: "Erro ao interpretar 'skills'", details: e.message });
                }
            }

            const member = await Members.create({
                full_name,
                birth_date,
                email,
                role,
                phone,
                gender,
                egress,
                skills: parsedSkills,
                password_hash,
                photo: req.file?.filename || null
            });

            return res.status(201).json({ message: "Administrador criado com sucesso!", member });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar administrador", details: error.message });
        }
    }

    async create(req, res) {
        try {
            const {
                full_name, birth_date, email,
                role, phone, gender, egress,
                skills, password
            } = req.body;

            if (!password || password.length < 6) {
                return res.status(400).json({ message: "Senha deve conter no mínimo 6 caracteres." });
            }

            if (req.file) {
                const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                if (!allowedTypes.includes(req.file.mimetype)) {
                    return res.status(400).json({ message: "Arquivo deve ser jpeg, jpg ou png." });
                }
                if (req.file.size > 2 * 1024 * 1024) {
                    return res.status(400).json({ message: "Arquivo limitado à 2MB." });
                }
            }

            if (!email.endsWith("@compjunior.com.br")) {
                return res.status(400).json({ message: "Email deve ser institucional à Comp Júnior." });
            }

            let parsedSkills = [];

            if (Array.isArray(skills)) {
                parsedSkills = skills;
            } else if (skills) {
                try {
                    parsedSkills = JSON.parse(skills);
                } catch (e) {
                    return res.status(400).json({ message: "Erro ao interpretar 'skills'", details: e.message });
                }
            }


            const password_hash = await bcrypt.hash(password, 8);

            const member = await Members.create({
                full_name,
                birth_date,
                email,
                role,
                phone,
                gender,
                egress,
                skills: parsedSkills,
                photo: req.file?.filename || null,
                password_hash,
            });

            return res.status(201).json({ message: "Membro criado com sucesso!", member });
        } catch (error) {
            return res.status(400).json({ message: "Erro ao criar membro.", details: error.message });
        }
    }

    async index(req, res) {
        const members = await Members.findAll();
        return res.json(members);
    }

    async show(req, res) {
        const { id } = req.params;
        const member = await Members.findByPk(id);

        if (!member) {
            return res.status(404).json({ message: "Membro não encontrado." });
        }

        return res.json(member);
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const member = await Members.findByPk(id);

            if (!member) {
                return res.status(404).json({ message: "Membro não encontrado." });
            }

            const {
                full_name, birth_date, email,
                role, phone, gender, egress,
                skills, password
            } = req.body;

            const password_hash = password
                ? await bcrypt.hash(password, 8)
                : member.password_hash;

            let parsedSkills = member.skills;
            if (Array.isArray(skills)) {
                parsedSkills = skills;
            } else if (skills) {
                try {
                    parsedSkills = JSON.parse(skills);
                } catch (e) {
                    return res.status(400).json({ message: "Erro ao interpretar 'skills'", details: e.message });
                }
            }

            await member.update({
                full_name: full_name ?? member.full_name,
                birth_date: birth_date ?? member.birth_date,
                email: email ?? member.email,
                role: role ?? member.role,
                phone: phone ?? member.phone,
                gender: gender ?? member.gender,
                egress: egress ?? member.egress,
                skills: parsedSkills,
                photo: req.file?.filename || member.photo,
                password_hash
            });

            return res.status(200).json({ message: "Membro atualizado!", member });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar membro.", details: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const member = await Members.findByPk(id);

            if (!member) {
                return res.status(404).json({ message: "Membro não encontrado." });
            }

            if (member.photo) {
                const photoPath = path.resolve(__dirname, "..", "..", "uploads", member.photo);
                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
            }

            await member.destroy();
            return res.status(200).json({ message: "Membro excluído!" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao excluir membro.", details: error.message });
        }
    }

    async promoteMember(req, res) {
        try {
            const { id } = req.params;
            const [updated] = await Members.update(
                { is_admin: true },
                { where: { id } }
            );

            if (updated === 0) {
                return res.status(404).json({ message: "Membro não encontrado." });
            }

            return res.status(200).json({ message: "Membro promovido à administrador!" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao promover membro", details: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email e senha são obrigatórios." });
            }

            const member = await Members.findOne({ where: { email } });
            if (!member) {
                return res.status(401).json({ message: "Usuário ou senha inválidos." });
            }

            const passwordValid = await member.checkPassword(password);
            if (!passwordValid) {
                return res.status(401).json({ message: "Usuário ou senha inválidos." });
            }

            const token = jwt.sign(
                { id: member.id, email: member.email, role: member.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.json({ token, member: { id: member.id, full_name: member.full_name, email: member.email, role: member.role } });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao realizar login.", details: error.message });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ message: "Email obrigatório" });

            const member = await Members.findOne({ where: { email } });
            if (!member) {
                // Para não expor se email existe ou não
                return res.status(200).json({ message: "Se o email estiver cadastrado, um link será enviado." });
            }

            const token = crypto.randomBytes(20).toString('hex');
            const expires = Date.now() + 3600000; // 1 hora

            member.reset_password_token = token;
            member.reset_password_expires = expires;
            await member.save();

            // Configurar nodemailer 
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const resetLink = `http://seusite.com/reset-password/${token}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: member.email,
                subject: 'Redefinição de senha',
                text: `Olá, você solicitou a redefinição de senha.\n\n
               Clique no link para redefinir: ${resetLink}\n\n
               Se não solicitou, ignore esse email.\n`
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: "Email de redefinição enviado." });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao processar recuperação de senha.", details: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            if (!password || password.length < 6) {
                return res.status(400).json({ message: "Senha deve conter no mínimo 6 caracteres." });
            }

            const member = await Members.findOne({
                where: {
                    reset_password_token: token,
                    reset_password_expires: { [Op.gt]: Date.now() }
                }
            });

            if (!member) {
                return res.status(400).json({ message: "Token inválido ou expirado." });
            }

            member.password = password; // o hook do model irá hash
            member.reset_password_token = null;
            member.reset_password_expires = null;

            await member.save();

            return res.status(200).json({ message: "Senha redefinida com sucesso." });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao redefinir senha.", details: error.message });
        }
    }
}

module.exports = new MemberController();
