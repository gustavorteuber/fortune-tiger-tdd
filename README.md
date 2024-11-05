# Blockchain com TypeScript Introduçao do TDD

Este repositório implementa uma blockchain básica utilizando TypeScript, seguindo os princípios de Desenvolvimento Orientado a Testes (TDD).

## Estrutura do Projeto - TDD
s
- `src/core/blockchain.ts` - Implementação da blockchain.
- `src/core/transaction.ts` - Definição do modelo de transação.
- `test/blockchain.test.ts` - Testes unitários para a blockchain.

## Pré-requisitos

- Node.js
- TypeScript
- Jest para testes unitários

## Configuração

Para configurar o projeto, execute os comandos:

```bash
npm install
npm install --save-dev jest @types/jest ts-jest tsx ts-node-dev typescript
npx ts-jest config:init
```

## Implementação da Blockchain com TDD

1. Definição da Estrutura de Dados
Primeiro, definimos a estrutura de dados para um bloco e uma transação.

Arquivo `transaction.ts:`

```typescript
export interface Transaction {
    betAmount: number;
    result: string[];
    winnings: number;
    timestamp: string;
}
```

Arquivo `blockchain.ts`:

```typescript
import { Transaction } from './transaction';

export interface Block {
    index: number;
    timestamp: string;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
}
```

2. Primeiro Teste: Inicialização da Blockchain
Escrevemos um teste para verificar se a blockchain inicializa corretamente com um bloco gênese.

Arquivo `blockchain.test.ts`:

```typescript
import { Blockchain } from '../src/core/blockchain';

describe('Blockchain', () => {
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it('deve criar o bloco gênese na inicialização se a blockchain estiver vazia', async () => {
        await blockchain.initializeChain();
        expect(blockchain.getChain()).toHaveLength(1);
        expect(blockchain.getChain()[0].index).toBe(1);
        expect(blockchain.getChain()[0].previousHash).toBe('0');
    });
});
```

3. Implementação do Bloco Gênese
Após rodar o teste e verificar que ele falha (Red), implementamos a criação do bloco gênese para que o teste passe (Green).

Arquivo `blockchain.ts`:

```typescript
import { Transaction } from './transaction';

export interface Block {
    index: number;
    timestamp: string;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
}

export class Blockchain {
    public chain: Block[] = [];

    constructor() {
        this.initializeChain();
    }

    public async initializeChain(): Promise<void> {
        if (this.chain.length === 0) {
            await this.createGenesisBlock();
        }
    }

    private async createGenesisBlock(): Promise<void> {
        const genesisBlock: Block = {
            index: 1,
            timestamp: new Date().toISOString(),
            transactions: [],
            previousHash: '0',
            hash: 'GENESIS_HASH', // Temporário
        };
        this.chain.push(genesisBlock);
    }

    public getChain(): Block[] {
        return this.chain;
    }
}
```

4. Teste para Adicionar Transações
Vamos adicionar um novo teste para verificar a funcionalidade de adicionar transações à blockchain.

Atualizando `blockchain.test.ts`:

```typescript
import { Blockchain } from '../src/core/blockchain';
import { Transaction } from '../src/core/transaction';

describe('Blockchain', () => {
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it('deve criar o bloco gênese na inicialização se a blockchain estiver vazia', async () => {
        await blockchain.initializeChain();
        expect(blockchain.getChain()).toHaveLength(1);
        expect(blockchain.getChain()[0].index).toBe(1);
        expect(blockchain.getChain()[0].previousHash).toBe('0');
    });

    it('deve adicionar uma transação ao bloco atual', async () => {
        const transaction: Transaction = {
            betAmount: 50,
            result: ['🐅', '🐅', '💎'],
            winnings: 100,
            timestamp: new Date().toISOString(),
        };

        blockchain.addTransaction(transaction);
        expect(blockchain.currentTransactions).toContain(transaction);
    });
});
```

## Implementação do Método addTransaction

Atualize `blockchain.ts` para implementar `addTransaction`:

```typescript
export class Blockchain {
    public chain: Block[] = [];
    public currentTransactions: Transaction[] = [];

    constructor() {
        this.initializeChain();
    }

    public async initializeChain(): Promise<void> {
        if (this.chain.length === 0) {
            await this.createGenesisBlock();
        }
    }

    private async createGenesisBlock(): Promise<void> {
        const genesisBlock: Block = {
            index: 1,
            timestamp: new Date().toISOString(),
            transactions: [],
            previousHash: '0',
            hash: 'GENESIS_HASH',
        };
        this.chain.push(genesisBlock);
    }

    public getChain(): Block[] {
        return this.chain;
    }

    public addTransaction(transaction: Transaction): void {
        this.currentTransactions.push(transaction);
    }
}
```

5. Geração de Hash para o Bloco
Para garantir a integridade de cada bloco, vamos adicionar um teste que verifica se o hash é gerado corretamente.

Atualizando `blockchain.test.ts`

```typescript
it('deve gerar um hash único para cada novo bloco', async () => {
    await blockchain.initializeChain();

    const previousBlock = blockchain.getChain()[0];
    const newBlock = await blockchain.createBlock();

    expect(newBlock.hash).toBeDefined();
    expect(newBlock.previousHash).toBe(previousBlock.hash);
    expect(newBlock.hash).not.toBe(previousBlock.hash);
});
```

## Implementação do Método createBlock com Hash

Implemente createBlock e generateHash para gerar um hash único para cada bloco.

Instale a biblioteca crypto caso não esteja disponível:

```bash
npm install crypto
```

Atualizando `blockchain.ts`:

```typescript
import { Transaction } from './transaction';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';

export interface Block {
    index: number;
    timestamp: string;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
}

export class Blockchain {
    public chain: Block[] = [];
    public currentTransactions: Transaction[] = [];
    public readonly chainFile = 'blockchain.json';

    constructor() {
        this.initializeChain(); // Carrega a blockchain existente ou cria uma nova
    }

    public async initializeChain(): Promise<void> {
        await this.loadChain(); // Tenta carregar a blockchain existente
        if (this.chain.length === 0) {
            // Cria o bloco gênese apenas se a blockchain estiver vazia
            await this.createBlock(1, '0');
        }
    }

    public async createBlock(index: number, previousHash: string): Promise<Block> {
        const block: Block = {
            index,
            timestamp: new Date().toISOString(),
            transactions: [...this.currentTransactions], // Copia as transações atuais
            previousHash,
            hash: this.hashBlock(index, previousHash, this.currentTransactions),
        };

        this.chain.push(block); // Adiciona o novo bloco à cadeia
        this.currentTransactions = []; // Limpa transações atuais apenas em memória
        await this.saveChain(); // Salva a blockchain com o novo bloco
        return block;
    }

    public addTransaction(transaction: Transaction): void {
        this.currentTransactions.push(transaction); // Adiciona a transação ao bloco atual
        this.saveChain(); // Salva a cadeia com as transações mais recentes
    }

    public getChain(): Block[] {
        return this.chain;
    }

    public hashBlock(index: number, previousHash: string, transactions: Transaction[]): string {
        const data = `${index}${previousHash}${JSON.stringify(transactions)}`;
        return createHash('sha256').update(data).digest('hex');
    }

    public async saveChain(): Promise<void> {
        const data = JSON.stringify(this.chain, null, 2);
        await fs.writeFile(this.chainFile, data); // Salva a blockchain completa no arquivo
    }

    public async loadChain(): Promise<void> {
        try {
            const data = await fs.readFile(this.chainFile, 'utf-8');
            this.chain = JSON.parse(data); // Carrega a blockchain do arquivo
        } catch (error) {
            console.error('Falha ao carregar a blockchain:', error);
        }
    }
}
```

Isso é TDD ;)
