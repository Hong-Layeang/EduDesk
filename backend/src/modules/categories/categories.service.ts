import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CacheService } from '../../common/services/cache.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  private readonly KEY_PREFIX = 'category:';
  private readonly KEY_LIST_VERSION = 'categories:version';

  private readonly TTL_ITEM = 10 * 60 * 1000;
  private readonly TTL_LIST = 5 * 60 * 1000;
  private readonly TTL_VERSION = 24 * 60 * 60 * 1000;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly cacheService: CacheService,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepo.create(dto);
    const saved = await this.categoryRepo.save(category);
    await this.cacheService.bumpVersion(this.KEY_LIST_VERSION, this.TTL_VERSION);
    return saved;
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<{ data: Category[]; meta: { total: number; page: number; limit: number } }> {
    const { page = 1, limit = 10 } = query;

    const version = await this.cacheService.getVersion(this.KEY_LIST_VERSION);
    const cacheKey = `categories:list:v${version}:p${page}:l${limit}`;

    const cached = await this.cacheService.get<{
      data: Category[];
      meta: { total: number; page: number; limit: number };
    }>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }
    this.logger.debug(`Cache MISS: ${cacheKey}`);

    const [data, total] = await this.categoryRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const result = { data, meta: { total, page, limit } };
    await this.cacheService.set(cacheKey, result, this.TTL_LIST);
    return result;
  }

  async findOne(id: string): Promise<Category> {
    const cacheKey = `${this.KEY_PREFIX}${id}`;

    const cached = await this.cacheService.get<Category>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }
    this.logger.debug(`Cache MISS: ${cacheKey}`);

    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Category #${id} not found`);

    await this.cacheService.set(cacheKey, category, this.TTL_ITEM);
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    const saved = await this.categoryRepo.save(category);
    await this.cacheService.del(`${this.KEY_PREFIX}${id}`);
    await this.cacheService.bumpVersion(this.KEY_LIST_VERSION, this.TTL_VERSION);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
    await this.cacheService.del(`${this.KEY_PREFIX}${id}`);
    await this.cacheService.bumpVersion(this.KEY_LIST_VERSION, this.TTL_VERSION);
  }
}
