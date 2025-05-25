module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('budgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      numero: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // número do orçamento deve ser único
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
          model: 'members', // tabela de membros
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // impede exclusão do membro se houver orçamento ligado
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('budgets');
  },
};
