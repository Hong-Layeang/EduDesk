import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import { seedCategories } from './category.seed';
import { seedClasses } from './class.seed';
import { seedStudents } from './student.seed';
import { seedScores } from './score.seed';

async function runSeed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  console.log('Running seeds...');

  await seedCategories(dataSource);
  await seedClasses(dataSource);
  await seedStudents(dataSource);
  await seedScores(dataSource);

  await dataSource.destroy();
  console.log('Seeds complete.');
}

runSeed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});