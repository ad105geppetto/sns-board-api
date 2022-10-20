import { IsEmail, IsString } from "class-validator";

export class UserInfoDTO {
  @IsEmail()
  @IsString()
  readonly email: string;
}
