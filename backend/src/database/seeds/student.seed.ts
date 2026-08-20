import { DataSource } from 'typeorm';
import { Gender, Student } from '../../modules/students/entities/student.entity';

type SeedStudent = Pick<
  Student,
  'khmerName' | 'gender' | 'classId' | 'className' | 'rollNumber' | 'avatarUrl'
>;

const STUDENTS: SeedStudent[] = [
  { khmerName: 'ចាន់ ដារា', gender: Gender.MALE, classId: '6a', className: 'ថ្នាក់ទី៦ក', rollNumber: '001', avatarUrl: 'https://i.pravatar.cc/150?img=12' },
  { khmerName: 'សុខ ស្រីណា', gender: Gender.FEMALE, classId: '6a', className: 'ថ្នាក់ទី៦ក', rollNumber: '002', avatarUrl: 'https://i.pravatar.cc/150?img=47' },
  { khmerName: 'វ៉ាន់ ពិសិដ្ឋ', gender: Gender.MALE, classId: '6a', className: 'ថ្នាក់ទី៦ក', rollNumber: '003', avatarUrl: 'https://i.pravatar.cc/150?img=33' },
  { khmerName: 'ម៉ៅ ចន្ទ្រា', gender: Gender.FEMALE, classId: '6a', className: 'ថ្នាក់ទី៦ក', rollNumber: '004', avatarUrl: 'https://i.pravatar.cc/150?img=25' },
  { khmerName: 'ណែត ស្រីពៅ', gender: Gender.FEMALE, classId: '6a', className: 'ថ្នាក់ទី៦ក', rollNumber: '005', avatarUrl: 'https://i.pravatar.cc/150?img=29' },
  { khmerName: 'ហ៊ិន ចំរើន', gender: Gender.MALE, classId: '6a', className: 'ថ្នាក់ទី៦ក', rollNumber: '006', avatarUrl: 'https://i.pravatar.cc/150?img=51' },
  { khmerName: 'គឹម សុភ័ក្ត្រ', gender: Gender.MALE, classId: '5b', className: 'ថ្នាក់ទី៥ខ', rollNumber: '001', avatarUrl: 'https://i.pravatar.cc/150?img=14' },
  { khmerName: 'លាង សុភាព', gender: Gender.FEMALE, classId: '5b', className: 'ថ្នាក់ទី៥ខ', rollNumber: '002', avatarUrl: 'https://i.pravatar.cc/150?img=48' },
  { khmerName: 'ជា វិចិត្រ', gender: Gender.MALE, classId: '4a', className: 'ថ្នាក់ទី៤ក', rollNumber: '001', avatarUrl: 'https://i.pravatar.cc/150?img=17' },
  { khmerName: 'យិន សុវណ្ណារី', gender: Gender.FEMALE, classId: '4a', className: 'ថ្នាក់ទី៤ក', rollNumber: '002', avatarUrl: 'https://i.pravatar.cc/150?img=36' },
  { khmerName: 'ព្រំ សុខលី', gender: Gender.FEMALE, classId: '3c', className: 'ថ្នាក់ទី៣គ', rollNumber: '001', avatarUrl: 'https://i.pravatar.cc/150?img=39' },
  { khmerName: 'ថន សំណាង', gender: Gender.MALE, classId: '3c', className: 'ថ្នាក់ទី៣គ', rollNumber: '002', avatarUrl: 'https://i.pravatar.cc/150?img=53' },
];

export async function seedStudents(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Student);

  for (const student of STUDENTS) {
    const exists = await repo.findOne({
      where: { classId: student.classId, rollNumber: student.rollNumber },
    });
    if (!exists) {
      await repo.save(repo.create(student));
    }
  }

  console.log(`  ✔ students seeded (${STUDENTS.length} records)`);
}