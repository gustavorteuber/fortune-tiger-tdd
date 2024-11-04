import { Transaction } from '../core/transaction';

export class TransactionRepository {
    private transactions: Transaction[] = [];

    public save(transaction: Transaction): void {
        this.transactions.push(transaction);
    }

    public getTransactions(): Transaction[] {
        return this.transactions;
    }
}
