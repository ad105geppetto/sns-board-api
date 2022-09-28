import { IsString } from "class-validator";

export class UserInfoDTO {
  @IsString()
  readonly email: string;
}