import { Module } from '@nestjs/common';
import { EventActionsService } from './event-actions.service';
import { EventActionsController } from './event-actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [EventActionsController],
  providers: [EventActionsService],
  exports: [EventActionsService],
})
export class EventActionsModule {}
