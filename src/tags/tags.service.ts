import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.tagRepository.save(createTagDto);
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  async findOne(id: string) {
    const tag = await this.tagRepository.findOneBy({
      id,
    });
    if (!tag) throw new NotFoundException();
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    await this.tagRepository.update({ id }, updateTagDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const tag = await this.findOne(id);
    return await this.tagRepository.remove(tag);
  }
}
