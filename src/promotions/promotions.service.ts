import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    protected promotionsRepository: Repository<Promotion>,
  ) {}

  create(createPromotionDto: CreatePromotionDto) {
    return this.promotionsRepository.create(createPromotionDto);
  }

  findAll() {
    return this.promotionsRepository.find();
  }

  findOne(id: bigint) {
    return this.promotionsRepository.findOneBy({ id });
  }

  update(id: bigint, updatePromotionDto: UpdatePromotionDto) {
    return this.promotionsRepository.update({ id }, updatePromotionDto);
  }

  remove(id: bigint) {
    return this.promotionsRepository.delete({ id });
  }
}
