import { FortuneTiger } from '../core/fortuneTiger';
import { Transaction } from '../core/transaction';
import { TransactionRepository } from '../data/transactionRepository';
import { Blockchain } from '../core/blockchain';

export class PlayGame {
    private blockchain: Blockchain;

    constructor(
        private game: FortuneTiger,
        private transactionRepository: TransactionRepository,
    ) {
        this.blockchain = new Blockchain();
    }

    public execute(betAmount: number): Transaction {
        const { result, winnings } = this.game.placeBet(betAmount);

        const transaction: Transaction = {
            betAmount,
            result,
            winnings,
            timestamp: new Date().toISOString(),
        };

        this.blockchain.addTransaction(transaction);
        this.blockchain.createBlock(this.blockchain.getChain().length + 1, this.blockchain.getChain()[this.blockchain.getChain().length - 1]?.hash || '0');
        this.transactionRepository.save(transaction);
        return transaction;
    }

    public getBlockchain(): Blockchain {
        return this.blockchain;
    }
}
