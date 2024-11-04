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
