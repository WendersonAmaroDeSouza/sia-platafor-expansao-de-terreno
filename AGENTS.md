---
description: AI development rules and architecture guide
alwaysApply: true
---

# AGENTS.md — AI Development Guide

Este arquivo define as regras que **IA e desenvolvedores devem seguir ao trabalhar neste repositório**.

Ele existe para garantir:

- consistência arquitetural
- geração de código previsível por IA
- separação correta de responsabilidades
- manutenção da qualidade do código

A arquitetura completa está documentada em:

docs/architecture.md

Se houver conflito entre este documento e `architecture.md`, **`architecture.md` é a fonte da verdade**.

---

# Arquitetura obrigatória

Este projeto utiliza:

MVVM + Services + Atomic Design

Fluxo de dependências:

View  
↓  
ViewModel  
↓  
UseCases  
↓  
Repositories (interfaces)  
↓  
Repository Implementations  
↓  
Gateways / Infrastructure  
↓  
External APIs / Database

Dependências **sempre fluem de cima para baixo**.

Nenhuma camada inferior pode depender de uma camada superior.

---

# Estrutura principal do projeto

Estrutura esperada:

```

src/

core/
  http/
  errors/
  di/

services/
  <module>/
    useCases/
    repositories/
    infrastructure/
      gateways/
      dto/
      mappers/
    selectors/

pages/

components/
  atoms/
  molecules/
  organisms/

stores/

utils/

formatters/

```

---

# Estrutura obrigatória de páginas

Toda nova página deve seguir:

```

/<NomeDaPagina>Page
  index.tsx
  <NomeDaPagina>View.tsx
  use<NomeDaPagina>ViewModel.ts

```

Exemplo:

```

/TablePage
  index.tsx
  TableView.tsx
  useTableViewModel.ts

```

---

# index.tsx

Responsável por **instanciar o ViewModel e conectar com a View**.

Exemplo:

```tsx
export default function TablePage() {
  const vm = useTableViewModel();
  return <TableView {...vm} />;
}
```

A View **nunca deve instanciar o ViewModel**.

---

# View

A View é responsável apenas por:

- renderização da interface
- estrutura do componente
- eventos de UI

A View recebe dados **somente via props do ViewModel**.

A View NÃO pode:

- conter regra de negócio
- acessar repositories
- acessar useCases
- acessar banco de dados
- acessar APIs diretamente

---

# ViewModel

ViewModels são responsáveis por:

- controlar estado da tela
- chamar UseCases
- preparar dados para a View
- usar Selectors
- usar Formatters
- consumir **stores Zustand**

ViewModels **NÃO podem acessar repositories diretamente**.

Sempre usar **UseCases**.

---

# Gerenciamento de estado

Para evitar **ViewModels muito grandes**, estados compartilhados devem usar **Zustand**.

Estrutura:

```
stores/
```

---

# UseCases

UseCases representam **ações do sistema**.

Responsabilidades:

- implementar regras de negócio
- orquestrar repositories
- validar regras

UseCases **não podem conhecer UI**.

### Convenção de nomes

Todos os arquivos devem seguir:

```
<action>UseCase.ts
```

Exemplo:

```
getTablesUseCase.ts
closeTableUseCase.ts
groupTablesUseCase.ts
```

---

# Retorno dos UseCases

UseCases devem retornar **Result Pattern**.

```ts
type Result<T> = { ok: true; data: T } | { ok: false; error: Error };
```

---

# Repositories

Repositories são responsáveis por:

- abstração de acesso a dados
- fornecer dados para UseCases
- coordenar Gateways

Repositories **devem ser interfaces**.

---

# Infrastructure

A pasta `infrastructure` contém integrações externas:

```
infrastructure/
  gateways/
  dto/
  mappers/
```

---

# Gateways

Gateways são responsáveis por:

- chamadas REST
- comunicação com APIs externas
- adaptação HTTP

Eles **não devem conter lógica de domínio**.

---

# DTO (Data Transfer Objects)

DTOs representam o formato **exato da API externa**.

DTOs **não devem ser usados diretamente na UI**.

---

# Mappers

Mappers convertem DTOs em entidades utilizadas pelo sistema.

Eles desacoplam o domínio das APIs externas.

---

# Selectors

Selectors transformam dados para a UI.

Responsabilidades:

- agregação de dados
- transformação para visualização
- preparação de dados para componentes

Devem ser:

- funções puras
- sem efeitos colaterais

Selectors **não pertencem à infraestrutura**.

---

# Formatters

Formatters são responsáveis apenas por **formatação visual de dados**.

Exemplos:

```
formatCurrency
formatDate
formatTimeSince
```

Eles **não podem conter lógica de negócio**.

---

# Utils

Helpers genéricos reutilizáveis.

Devem ser **funções puras sempre que possível**.

---

# Uso de index.ts nas pastas

Pastas principais devem possuir um `index.ts`.

Exemplo:

```
useCases/index.ts
```

```
export * from "./getTablesUseCase"
export * from "./closeTableUseCase"
```

---

# Regras obrigatórias para IA

Ao gerar código neste projeto:

1️⃣ Nunca colocar regra de negócio na View.

2️⃣ Sempre implementar regras em **UseCases**.

3️⃣ ViewModels devem usar **UseCases**, nunca repositories.

4️⃣ APIs externas devem ser acessadas apenas via **Gateways**.

5️⃣ Dados de APIs devem usar **DTO + Mapper**.

6️⃣ Transformações de dados devem usar **Selectors**.

7️⃣ Formatação visual deve usar **Formatters**.

8️⃣ Estados compartilhados devem usar **Zustand stores**.

9️⃣ Repositories devem ser **interfaces**.

🔟 Sempre respeitar a estrutura de diretórios definida em `architecture.md`.

---

Perfeito — essa seção realmente **melhora muito o comportamento de agentes de IA**, porque ela define **um algoritmo claro de implementação de feature**.
Vou adicionar a seção **“How to implement a new feature”** ao final do `AGENTS.md`, **integrando com o fluxo TDD que você já definiu**.

Abaixo está **somente a nova seção para adicionar ao final do arquivo** (ela já respeita tudo que você estabeleceu: arquitetura, TDD, cobertura 100%, etc.).

---

# How to implement a new feature

Esta seção define o **processo obrigatório que agentes de IA devem seguir ao implementar uma nova funcionalidade** neste projeto.

Sempre seguir **exatamente esta sequência**.

---

# 1️⃣ Entender o objetivo da feature

Antes de escrever código:

- identificar qual módulo de `services` será afetado
- identificar qual página ou ViewModel consumirá a funcionalidade
- identificar quais entidades ou dados serão manipulados

Nunca criar código sem entender **onde ele pertence na arquitetura**.

---

# 2️⃣ Criar ou localizar o módulo em services

Se a funcionalidade pertence a um módulo existente:

```

services/<module>/

```

Utilizar o módulo existente.

Caso contrário, criar um novo módulo seguindo a estrutura:

```

services/
  <module>/
    useCases/
    repositories/
    infrastructure/
      gateways/
      dto/
      mappers/
    selectors/

```

---

# 3️⃣ Criar os testes primeiro (TDD obrigatório)

Antes de implementar qualquer lógica:

Criar testes unitários para:

- UseCases
- Selectors
- Mappers (quando existirem)

Todos os testes devem:

- mockar dependências externas
- cobrir todos os cenários
- possuir **docstring explicando o cenário**

Exemplo:

```ts
/**
 * Scenario:
 * Should return tables when repository returns valid data
 */
```

Cenários mínimos esperados:

- sucesso
- erro de infraestrutura
- erro de regra de negócio
- edge cases

Somente após os testes estarem escritos deve-se iniciar a implementação.

---

# 4️⃣ Implementar o UseCase

Criar o UseCase seguindo o padrão:

```
services/<module>/useCases/<action>UseCase.ts
```

Exemplo:

```
getTablesUseCase.ts
createTableUseCase.ts
```

O UseCase deve:

- implementar regra de negócio
- usar repositories
- retornar Result Pattern

Nunca acessar UI ou infraestrutura diretamente.

---

# 5️⃣ Implementar ou atualizar Repository

Se necessário:

- criar ou atualizar interface do repository
- implementar `RepositoryImpl`

Estrutura:

```
repositories/
  TablesRepository.ts
  TablesRepositoryImpl.ts
```

RepositoryImpl pode usar:

- gateways
- mappers

---

# 6️⃣ Implementar infraestrutura (se necessário)

Caso haja integração externa:

Criar dentro de:

```
infrastructure/
```

Componentes possíveis:

```
gateways/
dto/
mappers/
```

Regras:

- gateways fazem chamadas HTTP
- DTO representa formato da API
- mapper converte DTO para entidade

---

# 7️⃣ Criar ou atualizar Selectors

Se a UI precisar de dados transformados:

Criar selectors em:

```
services/<module>/selectors/
```

Selectors devem ser:

- funções puras
- sem efeitos colaterais

---

# 8️⃣ Atualizar ViewModel

Após a lógica estar implementada:

Atualizar o ViewModel da página para usar o novo UseCase.

ViewModel deve:

- chamar UseCases
- preparar dados para View
- usar selectors se necessário

Nunca acessar repositories diretamente.

---

# 9️⃣ Atualizar a View

A View deve apenas:

- renderizar UI
- consumir props do ViewModel

Nunca implementar lógica de negócio.

---

# 🔟 Validar o projeto

Após implementar a feature:

Executar verificação de tipos:

```
npx tsc --noEmit
```

Executar testes:

```
npm test
```

Verificar cobertura:

Cobertura mínima obrigatória:

```
100%
```

---

# 1️⃣1️⃣ Corrigir falhas automaticamente

Se algum passo falhar:

- erro de TypeScript
- falha de teste
- cobertura menor que 100%

Então:

1. corrigir o problema
2. executar novamente os testes
3. repetir até que todos os passos passem

Nenhuma alteração deve ser considerada finalizada se:

- houver erro de tipagem
- algum teste falhar
- cobertura for menor que 100%

---

# Workflow de desenvolvimento (obrigatório)

Sempre seguir este fluxo ao implementar novas funcionalidades.

## 1️⃣ Criar testes unitários primeiro (TDD)

Sempre que for criar qualquer arquivo dentro de **services**, os testes devem ser criados **antes da implementação**.

Passos:

1. Criar o arquivo de teste correspondente.
2. Mockar todas as dependências externas.
3. Definir todos os cenários de teste.

Cada cenário deve possuir **docstring explicando o comportamento esperado**.

Exemplo:

```ts
/**
 * Scenario:
 * Should return tables when repository returns valid data
 */
```

Exemplo de cenários esperados:

- sucesso
- erro de infraestrutura
- erro de regra de negócio
- edge cases

Após escrever os testes, somente então implementar o código.

---

## 2️⃣ Implementar o código do service

Após os testes estarem definidos:

- implementar UseCases
- implementar RepositoryImpl
- implementar Gateways se necessário
- implementar Mappers

A implementação deve **satisfazer os testes existentes**.

---

## 3️⃣ Executar verificação de tipos

Sempre executar:

```
npx tsc --noEmit
```

Nenhum erro de tipagem é permitido.

---

## 4️⃣ Executar testes unitários

Executar todos os testes.

---

## 5️⃣ Verificar cobertura de testes

A cobertura mínima obrigatória é:

```
100%
```

Se algum arquivo tiver cobertura menor:

- adicionar novos cenários de teste
- cobrir todos os caminhos de execução

---

## 6️⃣ Corrigir erros automaticamente

Se qualquer um dos passos abaixo falhar:

- TypeScript
- testes unitários
- cobertura

então:

1. corrigir o problema
2. executar novamente
3. repetir até que tudo passe

---

# Princípios arquiteturais

Se alguma decisão não estiver clara no código, seguir:

- Clean Architecture
- Separation of Concerns
- Single Responsibility
