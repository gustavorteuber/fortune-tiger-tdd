import { Blockchain } from '../core/blockchain';
import { Transaction } from '../core/transaction';

describe('Blockchain', () => {
    it('deve inicializar com um bloco gênese', async () => {
        const blockchain = new Blockchain();
        await blockchain.initializeChain();

        expect(blockchain.getChain().length).toBeGreaterThan(0);
        expect(blockchain.getChain()[0].previousHash).toBe('0');
    });

    it('deve adicionar transações e criar um novo bloco', async () => {
        const blockchain = new Blockchain();
        await blockchain.initializeChain();

        const transaction: Transaction = {
            betAmount: 100,
            result: ['🐅', '💎', '🔔'],
            winnings: 50,
            timestamp: new Date().toISOString(),
        };

        blockchain.addTransaction(transaction);
        const previousHash = blockchain.getChain()[0].hash;
        const newBlock = await blockchain.createBlock(1, previousHash);

        expect(blockchain.getChain().length).toBe(2);
        expect(blockchain.getChain()[1].previousHash).toBe(previousHash);
        expect(blockchain.getChain()[1].transactions).toContain(transaction);
    });

    it('deve gerar o hash correto para um bloco', async () => {
        const blockchain = new Blockchain();
        await blockchain.initializeChain();

        const transaction: Transaction = {
            betAmount: 200,
            result: ['💎', '💎', '💎'],
            winnings: 100,
            timestamp: new Date().toISOString(),
        };

        blockchain.addTransaction(transaction);
        const previousHash = blockchain.getChain()[0].hash;
        const newBlock = await blockchain.createBlock(2, previousHash);

        const expectedHash = blockchain.hashBlock(
            newBlock.index,
            newBlock.previousHash,
            newBlock.transactions
        );

        expect(newBlock.hash).toBe(expectedHash);
    });

    it('deve chamar saveChain ao criar um bloco', async () => {
        const blockchain = new Blockchain();
        await blockchain.initializeChain();

        const transaction: Transaction = {
            betAmount: 300,
            result: ['🔔', '🐅', '💎'],
            winnings: 150,
            timestamp: new Date().toISOString(),
        };

        blockchain.addTransaction(transaction);
        const previousHash = blockchain.getChain()[0].hash;

        // Mock do método saveChain
        const saveChainSpy = jest.spyOn(blockchain, 'saveChain');
        await blockchain.createBlock(2, previousHash);

        expect(saveChainSpy).toHaveBeenCalled(); // Verifica se saveChain foi chamado
        saveChainSpy.mockRestore(); // Restaura o método original após o teste
    });
});
