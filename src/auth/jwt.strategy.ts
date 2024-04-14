import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './users.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {super({
    secretOrKey: 'topSecret51',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  });}

  async validate(payload:JwtPayload) {
    const {username} = payload;
    const user: User = await this.usersRepository.findOne({ where: { username } });
  }

}
