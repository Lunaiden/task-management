import { Repository } from 'typeorm';
import { Task } from './task.entity';
import dataSource from '../../db/db.config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

export class TasksRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task)
    private TasksRepository: Repository<Task>,
  ) {super(TasksRepository.target, TasksRepository.manager, TasksRepository.queryRunner);}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    query.where({user})

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` });
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.save(task);
    return task;
  }

}