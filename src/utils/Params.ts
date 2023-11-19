import { BadRequestException } from '@nestjs/common';

export function transformIdIntoNumber(id: string) {
  const itemId = Number(id);
  if (isNaN(itemId)) {
    throw new BadRequestException('Id needs to be a number');
  }

  return itemId;
}
