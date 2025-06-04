import { Module } from '@nestjs/common';
import { EventActionsService } from './event-actions.service';
import { EventActionsController } from './event-actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAction } from './entity/eventAction.entity';
import { EventActionRepository } from './repository/event-actions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EventAction])],
  controllers: [EventActionsController],
  providers: [EventActionsService, EventActionRepository],
  exports: [EventActionsService],
})
export class EventActionsModule {}
