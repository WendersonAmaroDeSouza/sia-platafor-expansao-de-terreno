# Architecture

## Overview

Este projeto utiliza uma arquitetura baseada em:

**MVVM + Services + Atomic Design**

O objetivo dessa arquitetura é garantir:

- Separação clara de responsabilidades
- Código testável
- Evitar **God Pages**
- Evitar acoplamento entre UI e lógica de negócio
- Facilitar manutenção e evolução do sistema
- Permitir geração consistente de código por IA
- Garantir reaproveitamento de componentes
- Facilitar integrações com **APIs REST externas**

---

# Arquitetura Geral

Fluxo de dependências:

```
View
↓
ViewModel
↓
UseCases
↓
Repositories (Interfaces)
↓
Repository Implementations
↓
Gateways / Infrastructure
↓
External APIs / Database
```

Camadas auxiliares:

- Selectors
- Formatters
- Utils

Regra importante:

**Dependências sempre fluem de cima para baixo.**

Nenhuma camada inferior pode depender de uma camada superior.

---

# Estrutura de diretórios ideal

```
src/

core/
  http/
    httpClient.ts
    httpInterceptor.ts

  errors/
    ApiError.ts
    DomainError.ts
    ValidationError.ts
    NotFoundError.ts

  di/
    container.ts

services/
  tables/

    useCases/
      getTablesUseCase.ts
      closeTableUseCase.ts
      groupTablesUseCase.ts
      cleanTableUseCase.ts
      index.ts

    repositories/
      TablesRepository.ts
      TablesRepositoryImpl.ts
      index.ts

    infrastructure/
      gateways/
        TablesApiGateway.ts

      dto/
        TableDTO.ts

      mappers/
        mapTable.ts

    selectors/
      getTableDisplaySelector.ts
      index.ts

pages/
  TablePage/
    index.tsx
    TableView.tsx
    useTableViewModel.ts

components/
  atoms/
  molecules/
  organisms/

stores/
  tableStore.ts

utils/

formatters/
```

---

# Estrutura de páginas

Cada página deve seguir o padrão:

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

Responsável por:

- Instanciar o ViewModel
- Conectar View e ViewModel

Exemplo:

```tsx
import { useTableViewModel } from "./useTableViewModel";
import { TableView } from "./TableView";

export default function TablePage() {
  const vm = useTableViewModel();

  return <TableView {...vm} />;
}
```

---

# View

Responsabilidade:

- Renderização da UI
- Estrutura do componente
- Eventos de interface

A View **não pode conter regra de negócio**.

Ela recebe dados apenas via props do ViewModel.

Tipagem recomendada:

```tsx
type Props = Readonly<ReturnType<typeof useTableViewModel>>;
```

### A View NÃO pode:

- acessar repositories
- acessar useCases
- acessar banco de dados
- instanciar ViewModel
- implementar regras de negócio

---

# ViewModel

Responsável por:

- Orquestrar lógica da página
- Consumir UseCases
- Preparar dados para a View
- Controlar estado da tela

O ViewModel pode:

- chamar UseCases
- usar Selectors
- usar Formatters
- usar Utils
- consumir **stores Zustand**

O ViewModel **não deve acessar diretamente repositories**.

---

# Gerenciamento de estado com Zustand

Para evitar **ViewModels muito grandes**, o estado compartilhado deve ser extraído para **stores utilizando Zustand**.

Exemplo:

```
stores/
  tableStore.ts
```

Exemplo:

```ts
import { create } from "zustand";

interface TableState {
  selectedTableId?: string;
  setSelectedTable: (id: string) => void;
}

export const useTableStore = create<TableState>((set) => ({
  selectedTableId: undefined,

  setSelectedTable: (id) => set({ selectedTableId: id }),
}));
```

---

# Services

A camada de **Services** concentra toda a lógica de domínio e integração com dados.

Os módulos devem ser organizados por **feature**.

Exemplo:

```
services/
  tables/
```

Dentro de cada módulo a organização deve separar claramente:

- **UseCases**
- **Repositories**
- **Infrastructure**
- **Selectors**

---

# Estrutura escalável de Services

Para melhorar a escalabilidade, elementos relacionados a **integrações externas** devem ficar dentro de `infrastructure`.

Isso inclui:

- Gateways
- DTOs
- Mappers

Exemplo:

```
services/
  tables/

    useCases/
    repositories/

    infrastructure/
      gateways/
      dto/
      mappers/

    selectors/
```

Essa organização evita que pastas cresçam de forma desordenada e separa claramente:

| Camada         | Responsabilidade       |
| -------------- | ---------------------- |
| UseCases       | regras de negócio      |
| Repositories   | abstração de dados     |
| Infrastructure | integração externa     |
| Selectors      | transformação de dados |

---

# UseCases

UseCases representam **ações do sistema**.

Exemplos:

- `getTablesUseCase`
- `closeTableUseCase`
- `groupTablesUseCase`
- `cleanTableUseCase`

Responsabilidades:

- implementar regras de negócio
- orquestrar repositórios
- validar regras do domínio

UseCases **não devem conhecer a UI**.

### Padronização de nomes

Todos os arquivos de UseCase devem seguir o padrão:

```
<acao>UseCase.ts
```

Exemplo:

```
getTablesUseCase.ts
closeTableUseCase.ts
```

Isso melhora:

- consistência do projeto
- busca de arquivos
- geração automática de código por IA

---

# Padronização de retorno de UseCases

Todos os UseCases devem retornar um **Result Pattern**.

Exemplo:

```ts
type Result<T> = { ok: true; data: T } | { ok: false; error: Error };
```

Uso:

```ts
const result = await getTablesUseCase();

if (!result.ok) {
  throw result.error;
}

return result.data;
```

Benefícios:

- fluxo de erro previsível
- evita uso excessivo de exceptions
- facilita tratamento na UI

---

# Repositories

Repositories são responsáveis por:

- abstrair acesso a dados
- fornecer dados ao domínio
- coordenar Gateways

Repositories **devem ser definidos como interfaces**.

Exemplo:

```ts
export interface TablesRepository {
  getTables(): Promise<Table[]>;
}
```

Implementação:

```ts
export class TablesRepositoryImpl implements TablesRepository {
  constructor(private api: TablesApiGateway) {}

  async getTables(): Promise<Table[]> {
    const data = await this.api.getTables();

    return data.map(mapTable);
  }
}
```

---

# Gateways

Gateways são responsáveis por:

- comunicação com **APIs externas**
- chamadas REST
- adaptação de protocolos HTTP

Eles **não devem conter lógica de domínio**.

Exemplo:

```ts
export class TablesApiGateway {
  async getTables(): Promise<TableDTO[]> {
    return httpClient.get("/tables");
  }
}
```

---

# DTO (Data Transfer Objects)

DTOs representam o formato **exato dos dados recebidos de APIs externas**.

Exemplo:

```ts
export interface TableDTO {
  id: string;
  number: number;
  status: string;
}
```

---

# Mappers

Mappers convertem DTOs em entidades utilizadas pelo sistema.

Exemplo:

```ts
export function mapTable(dto: TableDTO): Table {
  return {
    id: dto.id,
    number: dto.number,
    status: dto.status as TableStatus,
  };
}
```

Benefícios:

- desacopla domínio de APIs externas
- facilita adaptação a mudanças na API

---

# Selectors

Selectors são responsáveis por:

- transformar dados do domínio
- preparar dados para UI
- agregar informações

Exemplo:

```
buildTableDisplay()
```

Selectors devem ser:

- funções puras
- sem efeitos colaterais

### Nota importante

Selectors **não pertencem à infraestrutura**.

Eles fazem parte da lógica do módulo e devem permanecer diretamente dentro do módulo de `services`, fora da pasta `infrastructure`.

---

# Formatters

Formatters são responsáveis apenas por **formatação de dados para exibição**.

Exemplos:

- `formatCurrency`
- `formatTimeSince`
- `formatDate`

Regras:

- não podem conter regra de negócio
- devem apenas formatar valores

---

# Utils

Funções utilitárias reutilizáveis.

Exemplos:

- manipulação de datas
- helpers matemáticos
- helpers de estrutura

Regras:

- devem ser funções puras
- não devem conter lógica de domínio quando possível

---

# Error Handling Strategy

O sistema deve utilizar **erros padronizados** para facilitar tratamento e debugging.

Estrutura:

```
core/errors/
```

Exemplos:

```
ApiError.ts
DomainError.ts
ValidationError.ts
NotFoundError.ts
```

Exemplo:

```ts
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}
```

UseCases podem lançar erros de domínio.

ViewModels são responsáveis por tratar erros e exibir mensagens adequadas.

---

# Dependency Injection

O projeto deve utilizar **Dependency Injection** para desacoplar implementações concretas.

Estrutura:

```
core/di/container.ts
```

Exemplo:

```ts
export const container = {
  tablesRepository: new TablesRepositoryImpl(new TablesApiGateway()),
};
```

UseCases recebem dependências via construtor.

---

# Uso de index.ts nas pastas

Cada pasta principal deve possuir um **index.ts** exportando seus arquivos.

Exemplo:

```
useCases/
  index.ts
```

```ts
export * from "./getTablesUseCase";
export * from "./closeTableUseCase";
```

Isso permite imports mais limpos:

```ts
import { getTablesUseCase } from "@/services/tables/useCases";
```

---

# Regras arquiteturais obrigatórias

### 1️⃣ View não pode conter regra de negócio

Toda lógica deve estar no ViewModel ou UseCases.

---

### 2️⃣ View não pode acessar diretamente

- repositories
- useCases
- banco de dados

---

### 3️⃣ View não pode instanciar ViewModel

O ViewModel deve ser criado fora da View.

---

### 4️⃣ ViewModel não acessa banco diretamente

ViewModels devem usar UseCases.

---

### 5️⃣ UseCases centralizam regras de negócio

Toda regra crítica deve estar nos UseCases.

---

### 6️⃣ APIs externas devem ser acessadas apenas via Gateways

Isso evita acoplamento com infraestrutura.

---

# Benefícios da arquitetura

- Evita **God Components**
- Facilita testes
- Facilita manutenção
- Permite evolução do domínio
- Facilita geração de código por IA
- Facilita integrações REST
- Facilita componentização
- Reduz acoplamento com APIs externas
