import { Module, forwardRef  } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './plan.schema';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
    forwardRef(() => CountriesModule),
  ],
  providers: [PlansService],
  controllers: [PlansController],
  exports: [PlansService]
})
export class PlansModule {}
