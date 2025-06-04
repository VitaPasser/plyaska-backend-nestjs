import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.promotionsRepository.save(createPromotionDto);
  }

  findAll() {
    return this.promotionsRepository.find();
  }

  async findOne(id: string) {
    const promotion = await this.promotionsRepository.findOneBy({
      id,
    });
    if (!promotion) throw new NotFoundException();
    return promotion;
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto) {
    await this.promotionsRepository.update({ id }, updatePromotionDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const promotion = await this.findOne(id);
    await this.promotionsRepository.remove(promotion);
    return promotion;
  }
}
