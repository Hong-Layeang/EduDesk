import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';

// No controller yet — this module exists to register the Class entity/repo
// so other modules (e.g. Dashboard) can inject it. A full CRUD controller
// can be added later the same way categories/students were built.
@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  exports: [TypeOrmModule],
})
export class ClassesModule {}