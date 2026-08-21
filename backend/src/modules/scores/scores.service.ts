import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score, Subject, ScorePeriodType } from './entities/score.entity';
import { UpsertScoreDto } from './dto/upsert-score.dto';
import { CacheService } from '../../common/services/cache.service';

export interface AnnualScoreResult {
  studentId: string;
  subject: Subject;
  score: number | null;
}

@Injectable()
export class ScoresService {
  private readonly logger = new Logger(ScoresService.name);

  private readonly KEY_LIST_VERSION = 'scores:version';
  private readonly TTL_LIST = 2 * 60 * 1000;
  private readonly TTL_VERSION = 24 * 60 * 60 * 1000;

  constructor(
    @InjectRepository(Score)
    private readonly scoreRepo: Repository<Score>,
    private readonly cacheService: CacheService,
  ) {}

  async findForPeriod(
    classId: string,
    periodType: ScorePeriodType,
    periodKey = 0,
  ): Promise<Score[]> {
    const version = await this.cacheService.getVersion(this.KEY_LIST_VERSION);
    const cacheKey = `scores:list:v${version}:c${classId}:t${periodType}:k${periodKey}`;

    const cached = await this.cacheService.get<Score[]>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }
    this.logger.debug(`Cache MISS: ${cacheKey}`);

    const data = await this.scoreRepo.find({ where: { classId, periodType, periodKey } });

    await this.cacheService.set(cacheKey, data, this.TTL_LIST);
    return data;
  }

  async findAnnual(classId: string): Promise<AnnualScoreResult[]> {
    const [sem1, sem2] = await Promise.all([
      this.findForPeriod(classId, ScorePeriodType.SEMESTER1, 0),
      this.findForPeriod(classId, ScorePeriodType.SEMESTER2, 0),
    ]);

    const map = new Map<string, { sem1?: number; sem2?: number }>();

    for (const row of sem1) {
      const key = `${row.studentId}:${row.subject}`;
      map.set(key, { ...map.get(key), sem1: Number(row.score) });
    }
    for (const row of sem2) {
      const key = `${row.studentId}:${row.subject}`;
      map.set(key, { ...map.get(key), sem2: Number(row.score) });
    }

    return Array.from(map.entries()).map(([key, val]) => {
      const [studentId, subject] = key.split(':');
      const values = [val.sem1, val.sem2].filter((v): v is number => v !== undefined);
      const score = values.length
        ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100
        : null;
      return { studentId, subject: subject as Subject, score };
    });
  }

  async upsert(dto: UpsertScoreDto): Promise<Score> {
    let entity = await this.scoreRepo.findOne({
      where: {
        studentId: dto.studentId,
        subject: dto.subject,
        periodType: dto.periodType,
        periodKey: dto.periodKey ?? 0,
      },
    });

    if (entity) {
      entity.score = dto.score;
    } else {
      entity = this.scoreRepo.create({
        studentId: dto.studentId,
        classId: dto.classId,
        subject: dto.subject,
        periodType: dto.periodType,
        periodKey: dto.periodKey ?? 0,
        score: dto.score,
      });
    }

    const saved = await this.scoreRepo.save(entity);
    await this.cacheService.bumpVersion(this.KEY_LIST_VERSION, this.TTL_VERSION);
    return saved;
  }
}