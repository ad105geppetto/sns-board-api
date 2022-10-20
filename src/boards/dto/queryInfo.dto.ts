import { IsNumber, IsString, IsIn } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";

class QueryDTO {
  @IsString()
  readonly search: string;

  @IsIn(["createdAt", "views_count", "likes_count"])
  @IsString()
  readonly sortBy: "createdAt" | "views_count" | "likes_count";

  @Transform((params) => {
    return params.value.toLowerCase();
  })
  @IsIn(["desc", "asc"])
  @IsString()
  readonly orderBy: "desc" | "asc";

  @IsString()
  readonly filter: string;

  @IsNumber()
  readonly page: number;

  @IsNumber()
  readonly limit: number;
}

export class QueryInfoDTO extends PartialType(QueryDTO) {}
