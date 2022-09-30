import { IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

class QueryDTO {
  @IsString()
  readonly search: string;

  @IsString()
  readonly orderBy: string;

  @IsString()
  readonly filter: string;

  @IsNumber()
  readonly page: number;

  @IsNumber()
  readonly limit: number;
}


export class QueryInfoDTO extends PartialType(QueryDTO) { }