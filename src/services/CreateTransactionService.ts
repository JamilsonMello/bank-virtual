import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getCustomRepository(CategoryRepository);
    const transactionRepository = getCustomRepository(TransactionRepository);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total)
      throw new AppError('your balance is not enough');

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Type is not permitted');
    }

    const categoryExist = await categoryRepository.findCategory(category);

    let category_id = categoryExist?.id;

    if (!categoryExist) {
      const createCategory = categoryRepository.create({
        title: category,
      });
      const { id } = await categoryRepository.save(createCategory);

      category_id = id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
