import { IsArray, IsString } from "class-validator";

export class BoardInfoDTO {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsArray()
  @IsString({ each: true })
  readonly hashTags: string[];
}