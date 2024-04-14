import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // eager: true signifie qu'à chaque fois qu'on va récupérer un user, on récupèrera automatiquement ses tâches aussi.
  @OneToMany(_type => Task, task => task.user, { eager: true })
  tasks: Task[];
}

