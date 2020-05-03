import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance = await this.find();

    const newbalance = balance.reduce(
      (acumulator, element) => {
        acumulator.income +=
          element.type === 'income' ? Number(element.value) : 0;
        acumulator.outcome +=
          element.type === 'outcome' ? Number(element.value) : 0;
        acumulator.total = acumulator.income - acumulator.outcome;

        return acumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return newbalance;
  }
}

export default TransactionsRepository;
