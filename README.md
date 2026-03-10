# Order API

API REST para gerenciamento de pedidos utilizando Node.js, Express e MongoDB.  
O projeto permite criar, listar, atualizar e remover pedidos, realizando o mapeamento dos dados recebidos antes de salvar no banco.

## Tecnologias
- Node.js
- Express
- MongoDB
- Mongoose

## Como rodar

1. Instale as dependências:

```bash
npm install

Execute o servidor:

node server.js
Endpoints

POST /order — Criar pedido

GET /order/:id — Buscar pedido por ID

GET /order/list — Listar todos os pedidos

PUT /order/:id — Atualizar pedido

DELETE /order/:id — Deletar pedido
