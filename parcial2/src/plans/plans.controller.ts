import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './create-plan.dto';
import { PlanDto } from './plan.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly PlansService: PlansService) {}

  @Post()
  async create(@Body() createPlanDto: CreatePlanDto): Promise<PlanDto> {
    return this.PlansService.create(createPlanDto);
  }

  @Get()
  async findAll(): Promise<PlanDto[]> {
    return this.PlansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PlanDto> {
    const plan= await this.PlansService.findOne(id)
    if (!plan){
        throw new NotFoundException(`Plan with id: ${id} not found`);
    }
    return plan;
  }
}
