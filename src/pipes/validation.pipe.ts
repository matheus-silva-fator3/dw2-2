import {
  PipeTransform,
  BadRequestException,
  applyDecorators,
  UsePipes,
  ArgumentMetadata,
} from '@nestjs/common';
import { Schema, ValidationError } from 'joi';
import Validator from 'src/utils/Validator';

export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      try {
        Validator.assert(value, this.schema);
      } catch (error) {
        throw new BadRequestException(
          (error as ValidationError).details[0].message,
        );
      }
    }

    return value;
  }
}
/**
 * Validates the body of response against the provided schema
 * @param schema A joi schema
 */
export function Validate(schema: Schema) {
  return applyDecorators(UsePipes(new JoiValidationPipe(schema)));
}
