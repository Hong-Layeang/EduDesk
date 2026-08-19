import { DataSource } from 'typeorm';
import { Category } from '../../modules/categories/entities/category.entity';

const CATEGORIES: Pick<Category, 'name' | 'description'>[] = [
  { name: 'Breakfast', description: 'Morning meals served before 10:00 AM' },
  { name: 'Lunch', description: 'Midday meals served from 11:00 AM to 2:00 PM' },
  { name: 'Dinner', description: 'Evening meals served from 5:00 PM to 9:00 PM' },
  { name: 'Snacks', description: 'Light bites and appetizers available all day' },
  { name: 'Drinks', description: 'Beverages including coffee, tea, juice, and water' },
  { name: 'Desserts', description: 'Sweet treats and pastries' },
];

export async function seedCategories(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Category);

  await repo.upsert(CATEGORIES, { conflictPaths: ['name'], skipUpdateIfNoValuesChanged: true });

  console.log(`  ✔ categories seeded (${CATEGORIES.length} records)`);
}
