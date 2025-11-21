import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan } from './plan.schema';
import { CreatePlanDto } from './create-plan.dto';
import { PlanDto } from './plan.dto';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private PlanModel: Model<Plan>,
    private readonly countriesService: CountriesService,
  ) {}

  private toDto(doc: Plan): PlanDto {
        return {
            id: doc._id.toString(),
            countryCode: doc.countryCode,
            title: doc.title,
            startDate: doc.startDate.toISOString(),
            endDate: doc.endDate.toISOString(),
            notes: doc.notes,
            createdAt: doc.createdAt.toISOString(),
        };
    }
  async create(dto: CreatePlanDto): Promise<PlanDto> {
        // 1) Validar país (esto también lo cachea si no existe)
        await this.countriesService.findByCode(dto.countryCode);

        // 2) Validar fechas
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new BadRequestException('Formato invalido');
        }
        if (startDate >= endDate) {
            throw new BadRequestException(
                'La fecha de inicio es despues de la fecha de fin',
            );
        }
        // 3) Crear documento
        const created = new this.PlanModel({
            countryCode: dto.countryCode.toUpperCase(),
            title: dto.title,
            startDate,
            endDate,
            notes: dto.notes,
        });

        const saved = await created.save();
        return this.toDto(saved);
    }

  async findAll(): Promise<PlanDto[]> {
        const plans = await this.PlanModel
            .find()
            .exec();
        return plans.map((p) => this.toDto(p));
    }

  async findOne(id: string): Promise<PlanDto> {
        const plan = await this.PlanModel.findById(id).exec();
        if (!plan) {
            throw new NotFoundException(`Travel plan with id ${id} not found`);
        }
        return this.toDto(plan);
    }
}