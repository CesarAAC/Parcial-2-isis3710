export class CountryDto {
  code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flagUrl: string;
  source: 'api' | 'cache';
}