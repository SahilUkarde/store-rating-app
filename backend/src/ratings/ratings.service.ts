import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Store } from '../stores/store.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    @InjectRepository(Store) private storeRepo: Repository<Store>,
  ) {}

  async submitOrUpdate(userId: string, storeId: string, value: number) {
    if (value < 1 || value > 5) throw new BadRequestException('Rating must be between 1 and 5');

    const store = await this.storeRepo.findOne({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');

    let rating = await this.ratingRepo.findOne({
      where: { user_id: userId, store_id: storeId },
    });

    if (rating) {
      rating.value = value;
    } else {
      rating = this.ratingRepo.create({ user_id: userId, store_id: storeId, value });
    }

    return this.ratingRepo.save(rating);
  }
}
