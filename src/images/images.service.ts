import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
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
    return 'This action adds a new image';
  }

  async findAll() {
    return await this.imagesRepository.find();
  }

  async findOne(id: bigint) {
    return await this.imagesRepository.findOneBy({ id });
  }

  async findAllByEventActionId(id: bigint) {
    return await this.imagesRepository.findBy({ eventActions: { id } });
  }

  update(id: bigint, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  async remove(id: bigint) {
    return await this.imagesRepository.delete({ id });
  }
}
