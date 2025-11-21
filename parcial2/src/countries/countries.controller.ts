import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDto } from './country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(): Promise<CountryDto[]> {
    return this.countriesService.findAll();
  }

  @Get(':code')
  async findByCode(@Param('code') code: string): Promise<CountryDto> {
    const country = await this.countriesService.findByCode(code);
    if (!country) {
      throw new NotFoundException(`Country with code ${code} not found`);
    }
    return country;
  }
}
