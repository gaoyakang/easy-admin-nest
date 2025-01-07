import { SetMetadata } from '@nestjs/common';

export const requiredPermissions = () =>
  SetMetadata('requiredPermissions', true);
