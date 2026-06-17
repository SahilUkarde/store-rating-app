import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';

@Entity('ratings')
@Unique(['user_id', 'store_id'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  value: number;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Store, (store) => store.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  store_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
