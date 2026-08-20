import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../classes/entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { CacheService } from '../../common/services/cache.service';

export interface DashboardStatsResult {
  totalStudents: number;
  totalClasses: number;
  minGrade: number;
  maxGrade: number;
}

export interface DashboardClassSummaryResult {
  id: string;
  gradeLabel: string;
  className: string;
  thumbnailUrl: string | null;
  studentCount: number;
}

interface RawClassSummary {
  id: string;
  gradeLabel: string;
  className: string;
  thumbnailUrl: string | null;
  studentCount: string;
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  private readonly KEY_STATS = 'dashboard:stats';
  private readonly KEY_CLASSES = 'dashboard:classes';

  private readonly TTL_STATS = 2 * 60 * 1000;
  private readonly TTL_CLASSES = 2 * 60 * 1000;

  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    private readonly cacheService: CacheService,
  ) {}

  async getStats(): Promise<DashboardStatsResult> {
    const cached = await this.cacheService.get<DashboardStatsResult>(this.KEY_STATS);
    if (cached) {
      this.logger.debug(`Cache HIT: ${this.KEY_STATS}`);
      return cached;
    }
    this.logger.debug(`Cache MISS: ${this.KEY_STATS}`);

    // Fetch counts and IDs concurrently using Promise.all
    const [totalStudents, classes] = await Promise.all([
      this.studentRepo.count(),
      this.classRepo.find({ select: ['classId'] }) // Only fetch classId to save memory
    ]);
    
    const totalClasses = classes.length;

    const grades = classes
      .map((c) => this.parseGradeNumber(c.classId))
      .filter((n): n is number => n !== null);

    const minGrade = grades.length ? Math.min(...grades) : 0;
    const maxGrade = grades.length ? Math.max(...grades) : 0;

    const result: DashboardStatsResult = { totalStudents, totalClasses, minGrade, maxGrade };
    await this.cacheService.set(this.KEY_STATS, result, this.TTL_STATS);
    return result;
  }

  async getClassSummaries(): Promise<DashboardClassSummaryResult[]> {
    const cached = await this.cacheService.get<DashboardClassSummaryResult[]>(this.KEY_CLASSES);
    if (cached) {
      this.logger.debug(`Cache HIT: ${this.KEY_CLASSES}`);
      return cached;
    }
    this.logger.debug(`Cache MISS: ${this.KEY_CLASSES}`);

    // Fixed the syntax error by supplying the generic interface correctly to .query()
    const raw = await this.classRepo.manager.query<RawClassSummary[]>(
      `SELECT c.id as "id", c.grade_label as "gradeLabel", c.class_name as "className",
              c.thumbnail_url as "thumbnailUrl", COUNT(s.id) as "studentCount"
       FROM classes c
       LEFT JOIN students s ON s.class_id = c.class_id
       GROUP BY c.id, c.grade_label, c.class_name, c.thumbnail_url
       ORDER BY c.class_id ASC`,
    );

    const result = raw.map((row) => ({
      id: row.id,
      gradeLabel: row.gradeLabel,
      className: row.className,
      thumbnailUrl: row.thumbnailUrl,
      studentCount: Number(row.studentCount),
    }));

    await this.cacheService.set(this.KEY_CLASSES, result, this.TTL_CLASSES);
    return result;
  }

  private parseGradeNumber(classId: string): number | null {
    const match = classId.match(/^(\d+)/);
    return match ? Number(match[1]) : null;
  }
}
