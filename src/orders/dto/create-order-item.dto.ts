import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1, description: 'ID продукту' })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 2, description: 'Кількість', minimum: 1 })
  @IsInt()
  @Min(1) // Кількість не може бути меншою за 1!
  quantity: number;
}