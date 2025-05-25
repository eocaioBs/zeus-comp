const Sequelize = require("sequelize");
const { Model } = require("sequelize");
const bcryptjs = require("bcryptjs");

class Members extends Model {
    static init(sequelize) {
        super.init(
            {
                full_name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                birth_date: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                    validate: {
                        isBefore: new Date().toISOString(),
                    }
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        isEmail: true,
                        isInstitutionalEmail(value) {
                            if (!/@compjunior\.com\.br$/i.test(value)) {
                                throw new Error("Email must be an institutional address ending with @compjunior.com.br");
                            }
                        }
                    }
                },
                role: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                phone: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                gender: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                photo: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    validate: {
                        isImage(value) {
                            if (value && !/\.(jpg|jpeg|png)$/i.test(value)) {
                                throw new Error("Photo must be a JPG, JPEG, or PNG file");
                            }
                        }
                    },
                },
                egress: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    validate: {
                        isBefore: new Date().toISOString(),
                    },
                },
                skills: {
                    type: Sequelize.JSON,
                    allowNull: true,
                },
                password_hash: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                password: Sequelize.VIRTUAL,
                reset_password_token: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                reset_password_expires: {
                    type: Sequelize.DATE,
                    allowNull: true,
                }
            },
            {
                sequelize,
                modelName: "Member",
                tableName: "members",
            }
        );
        this.addHook('beforeSave', async (user) => {
            if (user.password) {
                user.password_hash = await bcryptjs.hash(user.password, 8);
            }
        });
        return this;
    }

    checkPassword(password) {
        return bcryptjs.compare(password, this.password_hash);
    }
}

module.exports = Members;