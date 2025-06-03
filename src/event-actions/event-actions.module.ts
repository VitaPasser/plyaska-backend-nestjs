import { Module } from '@nestjs/common';
import { EventActionsService } from './event-actions.service';
import { EventActionsController } from './event-actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAction } from './entity/eventAction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventAction])],
  controllers: [EventActionsController],
  providers: [EventActionsService],
  exports: [EventActionsService],
})
export class EventActionsModule {}
