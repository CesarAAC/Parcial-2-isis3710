import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './country.schema';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { CountriesProvider } from './countries.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
    HttpModule,
  ],
  providers: [CountriesService, CountriesProvider],
  controllers: [CountriesController],
  exports: [CountriesService],
})
export class CountriesModule {}
