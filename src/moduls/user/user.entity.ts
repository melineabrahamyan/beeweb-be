import { AbstractEntity } from '../../common';
import { Entity, Column, OneToMany } from 'typeorm';
import { MAX_NAME_LENGTH } from './constants';
import { Exclude } from 'class-transformer';
import { Workspace } from '../workspace/workspace.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: MAX_NAME_LENGTH,
    nullable: true,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: MAX_NAME_LENGTH,
    nullable: true,
  })
  lastName: string;

  @Column({ nullable: false, type: 'varchar' })
  @Exclude()
  password: string;

  @OneToMany(() => Workspace, (workspace) => workspace.user)
  workspaces: Workspace[];
}
