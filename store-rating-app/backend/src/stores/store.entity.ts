import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Rating } from '../ratings/rating.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 400 })
  address: string;

  @ManyToOne(() => User, (user) => user.stores, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ nullable: true })
  owner_id: string;

  @OneToMany(() => Rating, (rating) => rating.store)
  ratings: Rating[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
