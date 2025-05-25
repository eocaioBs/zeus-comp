const Budget = require("../models/Budgets");
const Members = require("../models/Members");

module.exports = {
    async create(req, res) {
        try {
            const {
                numero, descricao, cliente,
                membro_id, valor_estimado, custos_previstos
            } = req.body;

            const existing = await Budget.findOne({ where: { numero } });
            if (existing) {
                return res.status(400).json({ message: "Número de orçamento já cadastrado." });
            }

            const budget = await Budget.create({
                numero,
                descricao,
                cliente,
                membro_id,
                valor_estimado,
                custos_previstos,
                status: "em_analise"
            });

            return res.status(201).json({ message: "Orçamento criado com sucesso.", budget });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar orçamento", details: error.message });
        }
    },

    async index(req, res) {
        const budgets = await Budget.findAll({
            include: [{ model: Members, as: "responsavel", attributes: ["id", "full_name"] }]
        });
        return res.json(budgets);
    },

    async show(req, res) {
        const { id } = req.params;
        const budget = await Budget.findByPk(id, {
            include: [{ model: Members, as: "responsavel", attributes: ["id", "full_name"] }]
        });

        if (!budget) return res.status(404).json({ message: "Orçamento não encontrado." });
        return res.json(budget);
    },

    async update(req, res) {
        const { id } = req.params;
        const {
            numero, descricao, cliente,
            membro_id, valor_estimado, custos_previstos, status
        } = req.body;

        const budget = await Budget.findByPk(id);
        if (!budget) return res.status(404).json({ message: "Orçamento não encontrado." });

        await budget.update({
            numero: numero ?? budget.numero,
            descricao: descricao ?? budget.descricao,
            cliente: cliente ?? budget.cliente,
            membro_id: membro_id ?? budget.membro_id,
            valor_estimado: valor_estimado ?? budget.valor_estimado,
            custos_previstos: custos_previstos ?? budget.custos_previstos,
            status: status ?? budget.status
        });

        return res.status(200).json({ message: "Orçamento atualizado com sucesso.", budget });
    },

    async delete(req, res) {
        const { id } = req.params;
        const budget = await Budget.findByPk(id);

        if (!budget) return res.status(404).json({ message: "Orçamento não encontrado." });

        await budget.destroy();
        return res.status(200).json({ message: "Orçamento excluído com sucesso." });
    }
};
