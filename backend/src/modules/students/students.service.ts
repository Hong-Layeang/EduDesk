import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { CacheService } from '../../common/services/cache.service';

export interface StudentClassOption {
  classId: string;
  className: string;
  count: number;
}

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  private readonly KEY_PREFIX = 'student:';
  private readonly KEY_LIST_VERSION = 'students:version';
  private readonly KEY_CLASSES = 'students:classes';

  private readonly TTL_ITEM = 10 * 60 * 1000;
  private readonly TTL_LIST = 5 * 60 * 1000;
  private readonly TTL_VERSION = 24 * 60 * 60 * 1000;
  private readonly TTL_CLASSES = 5 * 60 * 1000;

  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    private readonly cacheService: CacheService,
  ) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepo.create(dto);
    const saved = await this.studentRepo.save(student);
    await this.invalidateListCache();
    return saved;
  }

  async findAll(
    query: QueryStudentDto,
  ): Promise<{ data: Student[]; meta: { total: number; page: number; limit: number } }> {
    const { page = 1, limit = 10, search, classId } = query;

    const version = await this.cacheService.getVersion(this.KEY_LIST_VERSION);
    const cacheKey = `students:list:v${version}:p${page}:l${limit}:s${search ?? ''}:c${classId ?? ''}`;

    const cached = await this.cacheService.get<{
      data: Student[];
      meta: { total: number; page: number; limit: number };
    }>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }
    this.logger.debug(`Cache MISS: ${cacheKey}`);

    const baseWhere: Record<string, unknown> = {};
    if (classId) baseWhere.classId = classId;

    const where = search
      ? { ...baseWhere, khmerName: ILike(`%${search}%`) }
      : baseWhere;

    const [data, total] = await this.studentRepo.findAndCount({
      where,
      order: { className: 'ASC', rollNumber: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const result = { data, meta: { total, page, limit } };
    await this.cacheService.set(cacheKey, result, this.TTL_LIST);
    return result;
  }

  async findOne(id: string): Promise<Student> {
    const cacheKey = `${this.KEY_PREFIX}${id}`;

    const cached = await this.cacheService.get<Student>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }
    this.logger.debug(`Cache MISS: ${cacheKey}`);

    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) throw new NotFoundException(`Student #${id} not found`);

    await this.cacheService.set(cacheKey, student, this.TTL_ITEM);
    return student;
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, dto);
    const saved = await this.studentRepo.save(student);
    await this.cacheService.del(`${this.KEY_PREFIX}${id}`);
    await this.invalidateListCache();
    return saved;
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepo.remove(student);
    await this.cacheService.del(`${this.KEY_PREFIX}${id}`);
    await this.invalidateListCache();
  }

  async getClasses(): Promise<StudentClassOption[]> {
    const cached = await this.cacheService.get<StudentClassOption[]>(this.KEY_CLASSES);
    if (cached) {
      this.logger.debug(`Cache HIT: ${this.KEY_CLASSES}`);
      return cached;
    }
    this.logger.debug(`Cache MISS: ${this.KEY_CLASSES}`);

    const raw = await this.studentRepo
      .createQueryBuilder('student')
      .select('student.class_id', 'classId')
      .addSelect('student.class_name', 'className')
      .addSelect('COUNT(*)', 'count')
      .groupBy('student.class_id')
      .addGroupBy('student.class_name')
      .orderBy('student.class_id', 'ASC')
      .getRawMany<{ classId: string; className: string; count: string }>();

    const result = raw.map((row) => ({
      classId: row.classId,
      className: row.className,
      count: Number(row.count),
    }));

    await this.cacheService.set(this.KEY_CLASSES, result, this.TTL_CLASSES);
    return result;
  }

  private async invalidateListCache(): Promise<void> {
    await this.cacheService.bumpVersion(this.KEY_LIST_VERSION, this.TTL_VERSION);
    await this.cacheService.del(this.KEY_CLASSES);
  }
}