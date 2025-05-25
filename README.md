
Zeus Comp é um sistema backend desenvolvido para a trilha de backend da CompJúnior, com foco na gestão de membros e orçamentos da empresa. O sistema implementa autenticação de usuários, controle de permissões, recuperação de senha e operações CRUD completas para membros e orçamentos.

🚀 Tecnologias Utilizadas
Node.js + JavaScript

Express

Sequelize + MySQL

JWT (autenticação)

Nodemailer (envio de e-mails)

Docker e Docker Compose (opcional)

📦 Funcionalidades Principais
Autenticação: login com JWT, recuperação e redefinição de senha por e-mail

Membros: cadastro, edição, listagem e exclusão de membros

Orçamentos: CRUD completo de orçamentos com status e valores

Controle de Acesso: sistema de permissões para ações administrativas

Validações: uso de JSON Schema para validar dados

⚙️ Como rodar o projeto
Pré-requisitos
Node.js v16+

MySQL

Docker (opcional)

Passos
Clone o repositório:

bash
Copiar
Editar
git clone https://github.com/eocaioBs/zeus-comp.git
cd zeus-comp
Instale as dependências:

bash
Copiar
Editar
npm install
Configure o arquivo .env com suas variáveis de ambiente:

ini
Copiar
Editar
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=zeus
JWT_SECRET=chave_secreta
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=suasenha
Rode as migrações (se necessário):

bash
Copiar
Editar
npx sequelize db:migrate
Inicie o servidor:

bash
Copiar
Editar
npm start
🔐 Variáveis de Ambiente
Consulte o arquivo .env.example para saber todas as variáveis necessárias.

🗂️ Estrutura de Pastas
bash
Copiar
Editar
src/
  controllers/      # Lógica dos endpoints
  models/           # Definições Sequelize
  routes/           # Rotas da aplicação
  middlewares/      # Middlewares de autenticação e validação
  services/         # Regras de negócio e helpers
  config/           # Conexão com banco de dados
📚 Exemplos de Uso da API
Login
http
Copiar
Editar
POST /auth/login
{
  "email": "admin@compjunior.com.br",
  "password": "senha123"
}
Recuperação de Senha
http
Copiar
Editar
POST /auth/forgot-password
{
  "email": "usuario@compjunior.com.br"
}
Criação de Membro
http
Copiar
Editar
POST /members
{
  "nome": "João",
  "email": "joao@compjunior.com.br",
  "password": "123456"
}
🏆 Autor
Caio Arthur Lima Domingos
Desenvolvido como projeto educacional para a CompJúnior – 2025
