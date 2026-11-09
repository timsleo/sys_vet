# 🐾 SysVet — Sistema de Gestão para Clínicas Veterinárias

Aplicação full-stack para o dia a dia de uma clínica veterinária: cadastro de clientes e pets, agendamento de consultas, prontuário médico e gestão de usuários por perfil de acesso.

## ✨ Funcionalidades

- **Clientes e pets** — CRUD completo, com busca por nome (autocomplete) e vínculo de múltiplos pets por cliente
- **Agendamentos** — marcação de consultas, banho e tosa e vacinação, com seleção de cliente/pet e horário
- **Prontuário médico** — registros de consultas, vacinas e exames vinculados ao pet, ao tutor e ao veterinário responsável
- **Login com JWT** — autenticação com token e perfis de acesso (admin, veterinário, atendente, tosador, banhista)
- **Relatórios e dashboard** — visão geral da operação da clínica

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| ORM | Prisma |
| Banco de dados | MongoDB (Atlas) |
| Autenticação | JWT + bcrypt |

## 🚀 Como rodar localmente

**Pré-requisitos:** Node.js 18+ e um cluster no [MongoDB Atlas](https://www.mongodb.com/atlas) (o tier gratuito funciona).

```bash
# 1. Clone o repositório
git clone https://github.com/timsleo/sys_vet.git
cd sys_vet

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
#    Copie o .env.example para .env e preencha os valores
cp .env.example .env

# 4. Gere o Prisma Client
npx prisma generate

# 5. Suba o backend (porta 3000)
npm run server

# 6. Em outro terminal, suba o frontend (porta 5173)
npm run dev
```

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do MongoDB Atlas |
| `JWT_SECRET` | Chave para assinar os tokens JWT — gere com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

> No Atlas, lembre-se de liberar o seu IP em **Network Access**.

## 📡 Principais rotas da API

| Método | Rota | Descrição |
|---|---|---|
| `GET/POST/PUT/DELETE` | `/clients` | CRUD de clientes (busca por nome via `?name=`) |
| `GET/POST/PUT/DELETE` | `/clients/:id/pets` | CRUD de pets de um cliente |
| `GET/POST/PUT/DELETE` | `/appointments` | Agendamentos de consultas e serviços |
| `GET/POST` | `/medical-records` | Prontuário médico dos pets |
| `POST` | `/users/register` · `/users/login` | Cadastro e autenticação de usuários |

## 🗺️ Roadmap

- [x] CRUD de clientes, pets, agendamentos e prontuários
- [x] Login com JWT e perfis de acesso
- [ ] Deploy (Vercel + Railway)
- [ ] Proteção das rotas da API com middleware de autenticação
- [ ] Dashboard com gráficos de ocupação e atendimento

## 👨‍💻 Autor

**Leo Tims** — estudante de Ciência da Computação, em busca de estágio como desenvolvedor full-stack.

[GitHub](https://github.com/timsleo)
