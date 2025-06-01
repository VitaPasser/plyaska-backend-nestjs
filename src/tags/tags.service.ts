import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Repository } from 'typeorm';
import { Tag } from './entity/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    protected tagRepository: Repository<Tag>,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagRepository.create(createTagDto);
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  async findOne(id: bigint) {
    return await this.tagRepository.findOneBy({
      id,
    });
  }

  async update(id: bigint, updateTagDto: UpdateTagDto) {
    return await this.tagRepository.update({ id }, updateTagDto);
  }

  async remove(id: bigint) {
    return await this.tagRepository.delete({
      id,
    });
  }
}
