import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { Store } from './store.entity';
import { Rating } from '../ratings/rating.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Rating, User])],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
