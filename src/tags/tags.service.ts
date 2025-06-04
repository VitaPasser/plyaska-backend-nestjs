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
    protected tagsRepository: Repository<Tag>,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagsRepository.save(createTagDto);
  }

  async findAll() {
    return await this.tagsRepository.find();
  }

  async findOne(id: string) {
    const tag = await this.tagsRepository.findOneBy({
      id,
    });
    if (!tag) throw new NotFoundException();
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    await this.tagsRepository.update({ id }, updateTagDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) throw new NotFoundException();
    await this.tagsRepository.delete({ id });
    return tag;
  }
}
