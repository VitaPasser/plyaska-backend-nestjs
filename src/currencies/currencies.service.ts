import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    protected currenciesRepository: Repository<Currency>,
  ) {}

  create(createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesRepository.create(createCurrencyDto);
  }

  findAll() {
    return this.currenciesRepository.find();
  }

  async findOne(id: number) {
    const currencies = await this.currenciesRepository.findOneBy({ id });
    if (!currencies) throw new NotFoundException();
    return currencies;
  }

  async update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    await this.currenciesRepository.update({ id }, updateCurrencyDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const currencies = await this.findOne(id);
    await this.currenciesRepository.remove(currencies);
    return currencies;
  }
}
