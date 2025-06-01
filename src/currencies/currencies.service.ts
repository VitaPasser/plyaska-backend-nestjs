import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return this.currenciesRepository.findOneBy({ id });
  }

  update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    return this.currenciesRepository.update({ id }, updateCurrencyDto);
  }

  remove(id: number) {
    return this.currenciesRepository.delete({ id });
  }
}
