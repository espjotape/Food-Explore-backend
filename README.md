## 📁 Projeto
O projeto Food Explorer consiste no desafio final do programa Explorer da Rocketseat. Trata-se de uma aplicação de cardápio digital para um restaurante fictício.

O back-end do projeto, que lida com a lógica e o armazenamento dos dados, está disponível neste repositório. Já o front-end, responsável pela interface do usuário, está disponível aqui.

## 📌 Estrutura
O projeto conta com as seguintes tabelas no banco de dados:

- Usuários: Contém informações dos usuários cadastrados, incluindo nome, e-mail, senha e cargo (admin ou cliente).

- Pratos: Armazena os pratos disponíveis, com nome, descrição, imagem e preço.

- Ingredientes: Relaciona os ingredientes de cada prato.

- Favoritos: Permite que os usuários favoritem pratos.

- Carrinho: Gerencia os itens adicionados ao carrinho de compras.

- Pedidos: Registra os pedidos feitos pelos usuários.

- Itens dos pedidos: Relaciona os pratos incluídos em cada pedido.

 ## 💻 Tecnologias
Este projeto foi desenvolvido com as seguintes tecnologias:

- Bcrypt.js

- CORS

- Dotenv
  
- Express.js
  
- express-async-errors
  
- JSON Web Token
  
- Knex.js
  
- Node.js
  
- Bcrypt.js (para criptografia de senhas)
  
- JSON Web Token (JWT) (para autenticação de usuários)
  
- CORS (para controle de acesso)
  
- Multer (para upload de imagens)
  
- Dotenv (para gerenciamento de variáveis de ambiente)

### 💡 Utilização
O back-end do projeto está hospedado no endereço [https://food-explorer-backend-oxwh.onrender.com](https://food-explore-backend-ww1f.onrender.com). A aplicação Food Explorer (Front-end) está disponível para uso aqui (https://foodexplorerjotape.netlify.app).

⚠️ Importante: Este projeto utiliza uma hospedagem gratuita para o back-end, portanto, pode haver atrasos no tempo de resposta do servidor.

Você também pode executá-lo em sua máquina localmente. Certifique-se de ter o Node.js e o npm instalados antes de prosseguir com as etapas abaixo:

### 1️⃣ Clonando o repositório
```bash
# Clone o repositório do front-end
git clone git@github.com:espjotape/Food-Explore-frontend.git

# Clone o repositório do back-end
git clone git@github.com:espjotape/Food-Explore-backend.git
```

### 2️⃣ Instalando dependências
```bash
# Acesse o diretório do front-end
cd Food-Explore-frontend
npm install

# Acesse o diretório do back-end
cd ../Food-Explore-backend
npm install
```

### 4️⃣ Configure as variáveis de ambiente:

Crie um arquivo .env na raiz do projeto seguindo o modelo do .env.example.

Preencha os campos necessários, como **AUTH_SECRET** e **PORT**.

### 5️⃣ Execute as migrations do banco de dados:
```
$ npm run migrate
```

### 6️⃣ Inicie o servidor:
```
$ npm start
```

#### ⚠️ Importante: Para gerar o valor para o campo AUTH_SECRET, você pode utilizar o MD5 Hash Generator para gerar uma sequência de caracteres segura.

Preencha o campo **PORT** com o número da porta desejada para executar o servidor da aplicação.
