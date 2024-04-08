import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`La tâche avec l'ID ${id} n'existe pas`);
    }

    return found;
  }

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

//
  async deleteTask(id: string): Promise<void> {
    // utiliser getTaskById permet de profiter de la gestion de l'erreur grâce au NotFoundException
    const result = await this.tasksRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`La tâche avec l'ID ${id} est introuvable`);
    }

  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    // utiliser getTaskById permet de profiter de la gestion de l'erreur grâce au NotFoundException
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}

