import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: { id, user },
    });

    if (!found) {
      throw new NotFoundException(`La tâche avec l'ID ${id} n'existe pas`);
    }

    return found;
  }

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

//
  async deleteTask(id: string, user: User): Promise<void> {
    // utiliser getTaskById permet de profiter de la gestion de l'erreur grâce au NotFoundException
    const result = await this.tasksRepository.delete({ id, user });

    if (!result.affected) {
      throw new NotFoundException(`La tâche avec l'ID ${id} est introuvable`);
    }

  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    // utiliser getTaskById permet de profiter de la gestion de l'erreur grâce au NotFoundException
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}

