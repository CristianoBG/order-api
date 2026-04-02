# 📦 Order API

> REST API para gerenciamento de pedidos, com mapeamento de payload externo, validação de dados e tratamento centralizado de erros.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.x-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-success?logo=mongodb)
![License](https://img.shields.io/badge/license-ISC-blue)

---

## 🏗️ Arquitetura

```
order-api/
├── src/
│   ├── app.js                  # Configuração do Express
│   ├── config/
│   │   └── database.js         # Conexão com MongoDB
│   ├── controllers/
│   │   └── orderController.js  # Lógica de negócio e tratamento de erros
│   ├── middlewares/
│   │   ├── errorHandler.js     # Handler centralizado de erros
│   │   └── notFound.js         # Resposta 404 para rotas inválidas
│   ├── models/
│   │   └── Order.js            # Schema Mongoose com validações
│   └── routes/
│       └── orderRoutes.js      # Definição das rotas
├── .env.example                # Variáveis de ambiente necessárias
├── docker-compose.yml          # MongoDB local via Docker
└── server.js                   # Entry point
```

---

## 🚀 Como rodar

### Pré-requisitos
- [Node.js 18+](https://nodejs.org)
- [Docker](https://www.docker.com/) (opcional, mas recomendado para o banco)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/order-api.git
cd order-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

### 4. Suba o MongoDB com Docker (recomendado)

```bash
docker-compose up -d
```

> Sem Docker? Use o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) gratuitamente e atualize o `MONGO_URI` no `.env`.

### 5. Inicie o servidor

```bash
# Produção
npm start

# Desenvolvimento (com hot-reload)
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## 🔍 Health Check

```bash
curl http://localhost:3000/health
```

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📋 Endpoints

| Método   | Rota           | Descrição               |
|----------|----------------|-------------------------|
| `GET`    | `/health`      | Status da API           |
| `POST`   | `/orders`      | Criar pedido            |
| `GET`    | `/orders`      | Listar todos os pedidos |
| `GET`    | `/orders/:id`  | Buscar pedido por ID    |
| `PUT`    | `/orders/:id`  | Atualizar pedido        |
| `DELETE` | `/orders/:id`  | Deletar pedido          |

---

## 📝 Exemplos de uso

### Criar pedido

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "PED-001",
    "valorTotal": 150.90,
    "dataCriacao": "2024-01-15T10:00:00.000Z",
    "items": [
      {
        "idItem": "101",
        "quantidadeItem": 2,
        "valorItem": 49.90
      },
      {
        "idItem": "202",
        "quantidadeItem": 1,
        "valorItem": 51.10
      }
    ]
  }'
```

**Resposta `201 Created`:**
```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "orderId": "PED-001",
  "value": 150.90,
  "creationDate": "2024-01-15T10:00:00.000Z",
  "items": [
    { "productId": 101, "quantity": 2, "price": 49.90 },
    { "productId": 202, "quantity": 1, "price": 51.10 }
  ],
  "createdAt": "2024-01-15T10:00:01.000Z",
  "updatedAt": "2024-01-15T10:00:01.000Z"
}
```

---

### Listar pedidos

```bash
curl http://localhost:3000/orders
```

**Resposta `200 OK`:**
```json
{
  "total": 1,
  "orders": [ { "..." } ]
}
```

---

### Buscar pedido por ID

```bash
curl http://localhost:3000/orders/PED-001
```

---

### Atualizar pedido

```bash
curl -X PUT http://localhost:3000/orders/PED-001 \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "PED-001",
    "valorTotal": 200.00,
    "dataCriacao": "2024-01-15T10:00:00.000Z",
    "items": [
      { "idItem": "101", "quantidadeItem": 4, "valorItem": 50.00 }
    ]
  }'
```

---

### Deletar pedido

```bash
curl -X DELETE http://localhost:3000/orders/PED-001
```

**Resposta `200 OK`:**
```json
{ "message": "Pedido deletado com sucesso" }
```

---

## ⚠️ Respostas de erro

| Status | Descrição                                 |
|--------|-------------------------------------------|
| `400`  | Payload inválido (campos obrigatórios)    |
| `404`  | Pedido não encontrado                     |
| `409`  | Já existe um pedido com o mesmo ID        |
| `500`  | Erro interno do servidor                  |

**Exemplo `400 Bad Request`:**
```json
{
  "error": "Dados inválidos",
  "details": [
    "numeroPedido é obrigatório",
    "items deve ser um array com ao menos 1 item"
  ]
}
```

---

## 🧠 Decisões técnicas

- **Mapeamento de payload**: A API recebe dados em português (`numeroPedido`, `valorTotal`) para manter compatibilidade com sistemas externos, e os converte para o schema interno em inglês antes de persistir.
- **Separação de responsabilidades**: Routes → Controllers → Models, sem lógica de negócio misturada em rotas.
- **Tratamento centralizado de erros**: Um único middleware captura todos os erros assíncronos, evitando duplicação de código.
- **Erro 409 para duplicatas**: O campo `orderId` é único; tentativas de criação com ID duplicado retornam `409 Conflict`.

---

## 🛠️ Tecnologias

| Tecnologia  | Versão | Uso                        |
|-------------|--------|----------------------------|
| Node.js     | 18+    | Runtime                    |
| Express     | 5.x    | Framework HTTP             |
| MongoDB     | 7.x    | Banco de dados             |
| Mongoose    | 8.x    | ODM / validações de schema |
| dotenv      | 17.x   | Variáveis de ambiente      |
| nodemon     | 3.x    | Hot-reload em dev          |

---

## 📄 Licença

ISC © Cristiano
