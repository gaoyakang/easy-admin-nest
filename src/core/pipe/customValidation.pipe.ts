import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    console.log(errors);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => {
          const field = error.property;
          const messages = Object.values(error.constraints).join(', ');
          return `${field}: ${messages}`;
        })
        .join('\n');

      throw new BadRequestException(errorMessages);
    }

    return value;
  }
}
