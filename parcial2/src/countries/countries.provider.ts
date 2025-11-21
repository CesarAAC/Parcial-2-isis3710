import { Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

export interface RestCountryData {
  code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flagUrl: string;
}

@Injectable()
export class CountriesProvider {
  constructor(private readonly httpService: HttpService) {}

  async getCountryByCode(code: string): Promise<RestCountryData> {
  const url = `https://restcountries.com/v3.1/alpha/${code}?fields=name,capital,region,subregion,population,flags,cca3`;

  try {
    const response: AxiosResponse<any> = await lastValueFrom(this.httpService.get(url));
    const data = response.data;
    if (!data) {
      throw new NotFoundException(
        `Country with code ${code} not found in RestCountries API`,
      );
    }
    return {
      code: data.cca3,
      name: data.name?.common,
      capital: Array.isArray(data.capital) ? data.capital[0] : data.capital,
      region: data.region,
      subregion: data.subregion,
      population: data.population,
      flagUrl: data.flags?.svg || data.flags?.png,
    };
  } catch (error: any) {
    console.error(
      'RestCountries API error:',
      error.message,
      error.response?.status,
      error.response?.data,
    );

    if (error.response?.status === 404) {
      throw new NotFoundException(
        `Country with code ${code} not found in RestCountries API`,
      );
    }
    if (error.response) {
      throw new InternalServerErrorException(
        `RestCountries API error (${error.response.status})`,
      );
    }
    throw new InternalServerErrorException(
      'Could not reach RestCountries API',
    );
  }
}
}


