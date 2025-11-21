import { Inject,Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from './country.schema';
import { CountriesProvider } from './countries.provider';
import { CountryDto } from './country.dto';
import { PlansService } from 'src/plans/plans.service';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name) 
    private countryModel: Model<Country>,
    private countryProvider: CountriesProvider,
    @Inject(forwardRef(() => PlansService))
    private readonly plansService: PlansService
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

  async deleteFromCache(code: string): Promise<CountryDto> {
    const country = await this.countryModel.findOne({ code }).exec();
    if (!country) {
      throw new NotFoundException(`Country with code ${code} not found in Cache`);
    }

    // Verificamos si existen planes de viaje asociados a este país
    const plansExist = await this.plansService.findPlansByCountryCode(code);
    if (plansExist.length > 0) {
      throw new NotFoundException(`Cannot delete country ${code} because there are travel plans associated`);
    }

    await country.deleteOne();  // Elimina el país de la base de datos
    return this.toDto(country, 'cache');
  }
}