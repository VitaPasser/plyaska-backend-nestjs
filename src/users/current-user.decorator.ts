import { applyDecorators, UseGuards } from '@nestjs/common';
import { CurrentUserGuard } from './current-user.guard';

export function CurrentUser() {
  return applyDecorators(UseGuards(CurrentUserGuard));
}
