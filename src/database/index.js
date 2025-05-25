const Sequelize = require('sequelize');
const Members = require("../apps/models/Members");
const Budgets = require("../apps/models/Budgets");

const models = [Members, Budgets];
const databaseConfig = require('../configs/db');

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models.map((model) => model.init(this.connection));

    }
}

module.exports = new Database();