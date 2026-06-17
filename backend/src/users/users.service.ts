import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';
import { Store } from '../stores/store.entity';
import { Rating } from '../ratings/rating.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Store) private storeRepo: Repository<Store>,
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashed });
    const saved = await this.userRepo.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async findAll(query: any) {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = query;
    const qb = this.userRepo.createQueryBuilder('user');

    if (name) qb.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    if (email) qb.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    if (address) qb.andWhere('user.address ILIKE :address', { address: `%${address}%` });
    if (role) qb.andWhere('user.role = :role', { role });

    const allowed = ['name', 'email', 'address', 'role', 'createdAt'];
    const col = allowed.includes(sortBy) ? sortBy : 'name';
    qb.orderBy(`user.${col}`, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');

    const users = await qb.select([
      'user.id', 'user.name', 'user.email', 'user.address', 'user.role', 'user.createdAt'
    ]).getMany();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    let rating = null;
    if (user.role === UserRole.STORE_OWNER) {
      const store = await this.storeRepo.findOne({ where: { owner_id: id } });
      if (store) {
        const ratings = await this.ratingRepo.find({ where: { store_id: store.id } });
        rating = ratings.length
          ? ratings.reduce((s, r) => s + r.value, 0) / ratings.length
          : null;
      }
    }

    const { password, ...rest } = user;
    return { ...rest, storeRating: rating };
  }

  async getDashboardStats() {
    const totalUsers = await this.userRepo.count();
    const totalStores = await this.storeRepo.count();
    const totalRatings = await this.ratingRepo.count();
    return { totalUsers, totalStores, totalRatings };
  }
}
