# Portal Sia — Expansão de Terrenos

Landing page inteligente para **captação e triagem automatizada de oportunidades de terrenos** para a Seazone.

O portal permite que **corretores imobiliários enviem oportunidades de terrenos** e recebam **feedback imediato através da IA Sia**, que interpreta automaticamente a descrição enviada.

---

# Visão do Produto

O **Portal Sia** foi criado para resolver um problema comum no processo de expansão imobiliária:

Corretores frequentemente possuem **oportunidades de terrenos**, mas não sabem **como ou para quem enviar** essas informações.

Tradicionalmente, essas oportunidades chegam por:

- WhatsApp
- E-mail
- Mensagens diretas
- Indicações informais

Isso gera:

- informações incompletas
- falta de padronização
- perda de oportunidades relevantes

O Portal Sia resolve isso com um **fluxo automatizado e estruturado**.

---

# Como funciona

1️⃣ O corretor acessa a landing page.

2️⃣ Preenche um formulário simples:

- Nome
- Email
- Descrição do terreno

Exemplo de descrição:

> Tenho um terreno de 500m² em Florianópolis frente mar por 2 milhões.

3️⃣ A descrição é enviada para a **IA Sia**.

4️⃣ A IA extrai automaticamente:

- cidade
- área
- valor

5️⃣ O sistema apresenta os dados para **confirmação do usuário**.

6️⃣ A oportunidade é **classificada automaticamente**.

7️⃣ Os dados são **armazenados para análise futura**.

---

# Arquitetura

Fluxo do sistema:

```
Landing Page
     ↓
Webhook
     ↓
Workflow automatizado
     ↓
IA (Gemini)
     ↓
Extração de dados
     ↓
Classificação da oportunidade
     ↓
Persistência (Google Sheets)
```

Automação do fluxo feita com **n8n**.

---

# Tecnologias utilizadas

Frontend

- Vite
- React
- TypeScript
- TailwindCSS
- shadcn/ui

Automação

- n8n

IA

- Google Gemini

Persistência inicial

- Google Sheets

---

# Estrutura do Projeto

```
/src
/components
/pages
/hooks
/lib
/styles
```

Principais responsabilidades:

**Frontend**

Interface da landing page e formulário de envio.

**Webhook**

Recepção dos dados enviados.

**Workflow**

Processamento da mensagem enviada pelo corretor.

**IA**

Interpretação da descrição do terreno.

---

# Como rodar o projeto localmente

## Pré-requisitos

- Node.js
- npm

Recomendado usar **nvm**.

---

## 1. Clonar o repositório

```bash
git clone <YOUR_GIT_URL>
```

---

## 2. Entrar na pasta do projeto

```bash
cd <PROJECT_NAME>
```

---

## 3. Instalar dependências

```bash
npm install
```

---

## 4. Rodar ambiente de desenvolvimento

```bash
npm run dev
```

O projeto ficará disponível em:

```
http://localhost:5173
```

---

# Integração com Automação

O formulário envia dados para um **webhook**, que aciona um workflow no **n8n**.

Responsabilidades do workflow:

- receber os dados do formulário
- enviar texto para IA
- extrair dados estruturados
- validar campos
- calcular valor por m²
- salvar dados na planilha
- retornar resposta da Sia

---

# MVP do Produto

Funcionalidades atuais:

- Landing page de captação
- Formulário de envio
- Extração de dados com IA
- Confirmação de dados
- Persistência em planilha
- Feedback automático

---

# Roadmap

Possíveis evoluções futuras:

- Dashboard interno
- Sistema de score de terrenos
- Upload de imagens e documentos
- Integração com CRM
- Detecção de duplicidade
- Detecção de spam
- Base de cidades prioritárias

---

# Deploy

O projeto pode ser publicado diretamente através da plataforma **Lovable**.

Acesse:

```
Share → Publish
```

Também é possível conectar um **domínio customizado**.

---

# Autor

Desenvolvido por

**Wenderson Amaro Sakamoto De Souza**

Senior Full Stack Developer

Especialista em:

- TypeScript
- Automação
- Integração com IA
- Arquiteturas de workflow
