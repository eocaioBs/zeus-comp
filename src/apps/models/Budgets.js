const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Budgets extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            numero: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            descricao: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            cliente: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            membro_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'members',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            valor_estimado: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            custos_previstos: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('em_analise', 'aprovado', 'reprovado'),
                allowNull: false,
                defaultValue: 'em_analise',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        }, {
            sequelize,
            modelName: "Budget",
            tableName: "budgets",
            timestamps: false,
        },
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Members, { foreignKey: "membro_id", as: "membro" });
    }
}

module.exports = Budgets;
