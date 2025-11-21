import { Controller, Get, Param, NotFoundException, Delete, UnauthorizedException, Headers, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDto } from './country.dto';
import { CacheGuard } from 'src/guards/cache.guard';

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

  @Delete(':code')
  @UseGuards(CacheGuard)
  async deleteFromCache(
    @Param('code') code: string,
  ): Promise<CountryDto> {
    const country = await this.countriesService.deleteFromCache(code);
    return country;
  }
}
