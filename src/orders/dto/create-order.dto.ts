import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Масив позицій замовлення',
    example: [
      { productId: 1, quantity: 2 },
      { productId: 5, quantity: 1 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1) // Замовлення не може бути порожнім!
  @ValidateNested({ each: true }) // Валідуємо кожен елемент масиву
  @Type(() => CreateOrderItemDto) // Перетворюємо звичайний JS-об'єкт на екземпляр класу DTO
  items: CreateOrderItemDto[];
}