import { DeepPartial, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../tasks/task.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class UsersRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {super(UsersRepository.target, UsersRepository.manager, UsersRepository.queryRunner);}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // hash puis stocke password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (err) {
      if(err.code === "23505") { // duplicate username
        throw new ConflictException("Ce nom d'utilisateur existe déjà.")
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

}

