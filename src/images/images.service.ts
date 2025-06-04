import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    protected imagesRepository: Repository<Image>,
  ) {}

  create(createImageDto: CreateImageDto) {
    return this.imagesRepository.save(createImageDto);
  }

  async findAll() {
    return await this.imagesRepository.find();
  }

  async findOne(id: string) {
    const image = await this.imagesRepository.findOneBy({ id });
    if (!image) throw new NotFoundException();
    return image;
  }

  async remove(id: string) {
    const image = await this.findOne(id);
    await this.imagesRepository.remove(image);
    return image;
  }
}
