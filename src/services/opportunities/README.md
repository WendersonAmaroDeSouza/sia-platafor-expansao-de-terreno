# Opportunities Service

Este módulo é responsável por gerenciar e extrair dados de oportunidades de terrenos.

## Arquitetura

O módulo segue a arquitetura definida em `docs/architecture.md`, utilizando:

- **UseCases**: Contêm a regra de negócio (ex: `extractOpportunityDataUseCase`).
- **Repositories**: Abstraem a fonte de dados (ex: `OpportunityRepository`).
- **Infrastructure**: Implementações concretas de acesso a dados e serviços externos.
  - **Gateways**: Responsáveis pela comunicação HTTP com serviços externos (N8N).
  - **DTOs**: Definem o formato dos dados recebidos da API externa.
  - **Mappers**: Convertem DTOs para modelos de domínio.

## Fluxo de Processamento de Extração

A extração de dados de oportunidade (`extractOpportunityDataUseCase`) foi refatorada para utilizar um serviço de IA externo via webhook N8N, eliminando processamento local.

O fluxo é o seguinte:

1.  **UseCase** recebe o texto da oportunidade, email e nome.
2.  **UseCase** chama `OpportunityRepository.extractData(text, email, nome)`.
3.  **Repository** delega a chamada para `OpportunityGateway`.
4.  **Gateway** envia uma requisição POST para a URL configurada no `.env` (`VITE_OPPORTUNITY_SERVICE_URL`).
    - **Payload enviado:**
      ```json
      {
        "text": "Descrição do terreno...",
        "email": "usuario@email.com",
        "nome": "Nome do Usuário"
      }
      ```
    - Implementa **Retry Logic** com Exponential Backoff para falhas de rede ou erros 5xx.
    - Implementa **Timeout** (padrão 10000ms).
    - Valida o schema da resposta.
5.  **Gateway** recebe o JSON de resposta (DTO), que pode ser de sucesso ou solicitação de esclarecimento.
6.  **Repository** usa `OpportunityMapper` para converter o DTO para o modelo de domínio `ExtractionResult`.
7.  **UseCase** retorna o resultado para o consumidor.

## Configuração

Para que a extração funcione, é necessário configurar a URL do serviço externo no arquivo `.env` na raiz do projeto.

### Variáveis de Ambiente

Crie ou edite o arquivo `.env`:

```env
VITE_OPPORTUNITY_SERVICE_URL=...
```

> **Nota:** A variável deve ser prefixada com `VITE_` para ser acessível pelo cliente (browser) em projetos Vite.

### Atualização do Workflow N8N

**Atenção:** O workflow no N8N deve ser ajustado para receber os novos campos enviados no payload.

- **Entrada Anterior:** `{ "text": "..." }`
- **Nova Entrada:** `{ "text": "...", "email": "...", "nome": "..." }`

Certifique-se de que o nó **Webhook** ou o nó de processamento subsequente no N8N esteja mapeando corretamente as propriedades `email` e `nome` do corpo da requisição JSON.

### Tratamento de Erros

O serviço trata os seguintes cenários:

- **Sucesso (200)**: Retorna os dados extraídos (`OpportunityData`) com prioridade já definida.
- **Esclarecimento**: Retorna campos faltantes e perguntas (`ClarificationData`).
- **Service Unavailable (500, 503)**: O sistema tenta novamente (até 3 vezes) com backoff exponencial. Se persistir, retorna erro de serviço indisponível.
- **Timeout**: Se o serviço demorar mais que 10s, a requisição é abortada e retorna erro de timeout.
- **Malformed Response**: Retorna erro se a resposta não seguir o schema esperado.
