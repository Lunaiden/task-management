import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8, {message: "Le mot de passe doit faire au moins 8 caractères"})
  @MaxLength(32,{message: "Le mot de passe doit faire maximum 32 caractères"} )
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Le mot de passe est trop faible"
  })
  password: string;
}



