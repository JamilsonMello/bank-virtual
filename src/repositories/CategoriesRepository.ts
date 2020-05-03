import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findCategory(category: string): Promise<Category | undefined> {
    const findCategory = await this.findOne({
      where: {
        title: category,
      },
    });

    return findCategory;
  }
}

export default CategoriesRepository;
