import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { Rating } from '../ratings/rating.entity';
import { User, UserRole } from '../users/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storeRepo: Repository<Store>,
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateStoreDto) {
    const existing = await this.storeRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Store email already exists');

    if (dto.owner_id) {
      const owner = await this.userRepo.findOne({ where: { id: dto.owner_id } });
      if (!owner) throw new NotFoundException('Owner not found');
      // Elevate owner to store_owner role
      owner.role = UserRole.STORE_OWNER;
      await this.userRepo.save(owner);
    }

    const store = this.storeRepo.create(dto);
    return this.storeRepo.save(store);
  }

  async findAll(query: any, userId?: string) {
    const { name, address, sortBy = 'name', order = 'ASC' } = query;

    const qb = this.storeRepo
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.ratings', 'rating');

    if (name) qb.andWhere('store.name ILIKE :name', { name: `%${name}%` });
    if (address) qb.andWhere('store.address ILIKE :address', { address: `%${address}%` });

    const allowed = ['name', 'email', 'address', 'createdAt'];
    const col = allowed.includes(sortBy) ? sortBy : 'name';
    qb.orderBy(`store.${col}`, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');

    const stores = await qb.getMany();

    return stores.map((store) => {
      const ratings = store.ratings || [];
      const avgRating = ratings.length
        ? ratings.reduce((s, r) => s + r.value, 0) / ratings.length
        : null;
      const userRating = userId
        ? ratings.find((r) => r.user_id === userId)?.value ?? null
        : undefined;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avgRating ? parseFloat(avgRating.toFixed(2)) : null,
        userRating,
        totalRatings: ratings.length,
      };
    });
  }

  async findOne(id: string) {
    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['ratings', 'owner'],
    });
    if (!store) throw new NotFoundException('Store not found');
    const ratings = store.ratings || [];
    const avg = ratings.length
      ? ratings.reduce((s, r) => s + r.value, 0) / ratings.length
      : null;
    return { ...store, averageRating: avg ? parseFloat(avg.toFixed(2)) : null };
  }

  async getOwnerDashboard(ownerId: string) {
    const store = await this.storeRepo.findOne({
      where: { owner_id: ownerId },
      relations: ['ratings', 'ratings.user'],
    });
    if (!store) throw new NotFoundException('No store found for this owner');

    const ratings = store.ratings || [];
    const avg = ratings.length
      ? ratings.reduce((s, r) => s + r.value, 0) / ratings.length
      : null;

    return {
      store: { id: store.id, name: store.name, address: store.address, email: store.email },
      averageRating: avg ? parseFloat(avg.toFixed(2)) : null,
      totalRatings: ratings.length,
      raters: ratings.map((r) => ({
        userId: r.user_id,
        name: r.user?.name,
        email: r.user?.email,
        rating: r.value,
        submittedAt: r.createdAt,
      })),
    };
  }
}
