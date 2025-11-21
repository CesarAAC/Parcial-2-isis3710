import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from './country.schema';
import { CountriesProvider } from './countries.provider';
import { CountryDto } from './country.dto';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name) 
    private countryModel: Model<Country>,
    private countryProvider: CountriesProvider,
  ) {}

  private toDto(
    country: Country,
    source: 'api' | 'cache',
  ): CountryDto {
    return {
      code: country.code,
      name: country.name,
      region: country.region,
      subregion: country.subregion,
      capital: country.capital,
      population: country.population,
      flagUrl: country.flagUrl,
      source
    };
  }

  async findAll(): Promise<CountryDto[]> {
    const countries = await this.countryModel.find().exec();
    return countries.map((c) => this.toDto(c, 'cache'));
  }

  async findByCode(code: string): Promise<CountryDto> {
    //1. Tratar de obtenerlo de cache:
    var res;
    const countryCache= await this.countryModel.findOne({ code }).exec();
    if (!countryCache){
      
      //2. Intentamos obtenerlo de la api:
      res = await this.countryProvider.getCountryByCode(code);
      // y guardar
      const created = new this.countryModel({
      code: res.code,
      name: res.name,
      region: res.region,
      subregion: res.subregion,
      capital: res.capital,
      population: res.population,
      flagUrl: res.flagUrl
      });
      const saved = await created.save();
      return this.toDto(created, "api")
      }else {
    res=countryCache
    }
    return this.toDto(res, "cache")
  }
}