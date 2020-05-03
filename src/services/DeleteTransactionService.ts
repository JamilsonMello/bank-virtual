import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const idExist = await transactionRepository.findOne({
      where: {
        id,
      },
    });

    if (!idExist) {
      throw new AppError('This transaction does not exist');
    }

    await transactionRepository.remove(idExist);
  }
}

export default DeleteTransactionService;
