import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    // define a temporary array to hold the result
    let tasks = this.getAllTasks();

    // do something with status
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    // do something with search
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.title.includes(search)) {
          return true;
        }
        return false;
      });
    }

    // return final result
    return tasks;

  }

  getTaskById(id: string): Task {
    // essayer de récupérer une tâche
    const found = this.tasks.find((task) => task.id === id);

    // si on ne la trouve pas, on envoie une erreur NotFound
    if (!found) {
      throw new NotFoundException(`La tâche avec l'ID ${id} n'existe pas`);
    }

    // sinon, on retourne la tâche trouvée
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    // utiliser getTaskById permet de profiter de la gestion de l'erreur grâce au NotFoundException
    const found = this.getTaskById(id);

    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    // utiliser getTaskById permet de profiter de la gestion de l'erreur grâce au NotFoundException
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}

