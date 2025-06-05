import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EventActionsService } from './event-actions.service';
import { CreateEventActionDto } from './dto/create-event.dto';
import { UpdateEventActionDto } from './dto/update-event.dto';
import { Public } from 'src/auth/public.const';
import { Roles } from 'src/users/roles/roles.decorator';
import { Role } from 'src/users/roles/enums/role.enum';
import { FindNearestWithPromotionAndPaginationPageEventActionDto } from './dto/find-nearest-with-promotion-and-pagination.dto';

@Controller('events')
export class EventActionsController {
  constructor(private readonly eventService: EventActionsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventActionDto) {
    return this.eventService.create(createEventDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Public()
  @Get('near')
  findNear(
    @Query() dto: FindNearestWithPromotionAndPaginationPageEventActionDto,
  ) {
    return this.eventService.findNearestWithPromotionAndPagination(dto);
  }

  @Public()
  @Get('near/:categoryName')
  findNearByCategoryId(
    @Query()
    dto: FindNearestWithPromotionAndPaginationPageEventActionDto,
    @Param() categoryName: string,
  ) {
    return this.eventService.findNearestWithPromotionAndPaginationByCategoryName(
      { ...dto, categoryName },
    );
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventActionDto,
  ) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
