const { Router } = require("express");
const MemberController = require("./apps/controller/MemberController");
const BudgetController = require("./apps/controller/BudgetController");
const AuthController = require("./apps/controller/AuthController");
const schemaValidator = require("./apps/middlewares/schemaValidator");
const memberSchema = require("../src/schema/create.member.schema.json");
const routes = new Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

routes.get("/health", (req, res) => {
    return res.send({ message: "SLK" });
});

routes.get("/members", MemberController.index);
routes.get("/members/:id", MemberController.show);

routes.post("/setup", upload.single("photo"), MemberController.setup);
routes.post("/members", upload.single("photo"), MemberController.create);

routes.put("/members/:id", upload.single("photo"), MemberController.update);
routes.delete("/members/:id", MemberController.delete);

routes.post('/login', MemberController.login);
routes.post('/forgot-password', MemberController.forgotPassword);
routes.post('/reset-password/:token', MemberController.resetPassword);


routes.post("/budget", BudgetController.create);
routes.get("/budget", BudgetController.index);
routes.get("/budget:id", BudgetController.show);
routes.put("/budget:id", BudgetController.update);
routes.delete("/budget:id", BudgetController.delete);
// routes.patch("/members/:id/promote", MemberController.promoteMember);


module.exports = routes;