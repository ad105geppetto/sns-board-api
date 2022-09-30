import { PartialType } from "@nestjs/mapped-types";
import { BoardInfoDTO } from "./boardInfo.dto";

export class UpdateBoardInfoDTO extends PartialType(BoardInfoDTO) { }