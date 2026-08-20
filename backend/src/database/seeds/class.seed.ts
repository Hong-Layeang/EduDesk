import { DataSource } from 'typeorm';
import { Class } from '../../modules/classes/entities/class.entity';

const CLASSES: Pick<Class, 'classId' | 'gradeLabel' | 'className' | 'thumbnailUrl'>[] = [
  { classId: '6a', gradeLabel: 'ថ្នាក់ទី៦', className: 'ថ្នាក់ទី៦ក', thumbnailUrl: 'https://picsum.photos/seed/edudesk-class-6a/200/200' },
  { classId: '5b', gradeLabel: 'ថ្នាក់ទី៥', className: 'ថ្នាក់ទី៥ខ', thumbnailUrl: 'https://picsum.photos/seed/edudesk-class-5b/200/200' },
  { classId: '4a', gradeLabel: 'ថ្នាក់ទី៤', className: 'ថ្នាក់ទី៤ក', thumbnailUrl: 'https://picsum.photos/seed/edudesk-class-4a/200/200' },
  { classId: '3c', gradeLabel: 'ថ្នាក់ទី៣', className: 'ថ្នាក់ទី៣គ', thumbnailUrl: 'https://picsum.photos/seed/edudesk-class-3c/200/200' },
];

export async function seedClasses(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Class);

  await repo.upsert(CLASSES, { conflictPaths: ['classId'], skipUpdateIfNoValuesChanged: true });

  console.log(`  ✔ classes seeded (${CLASSES.length} records)`);
}