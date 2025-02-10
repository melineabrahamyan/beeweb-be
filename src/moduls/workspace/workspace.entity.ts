import { AbstractEntity } from '../../common';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('workspaces')
export class Workspace extends AbstractEntity {
  @Column()
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description?: string;

  @ManyToOne(() => User, (user) => user.workspaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
