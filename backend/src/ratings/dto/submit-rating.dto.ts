import { IsInt, Min, Max, IsUUID } from 'class-validator';

export class SubmitRatingDto {
  @IsUUID()
  storeId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}
