import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/**
 * Doc an endpoint on swagger.
 */
export class DocOptions {
  operation: Partial<OperationObject>;
  responses: ApiResponseOptions[];
}

export function Docs({ operation, responses }: DocOptions) {
  return applyDecorators(
    ApiOperation(operation),
    ...responses.map((option) => ApiResponse(option)),
  );
}
