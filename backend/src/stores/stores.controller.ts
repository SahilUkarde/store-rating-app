import {
  Controller, Get, Post, Param, Body, Query, UseGuards, Request
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { UserRole } from '../users/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  // static routes MUST come before parameterised :id
  @UseGuards(RolesGuard)
  @Roles(UserRole.STORE_OWNER)
  @Get('owner/dashboard')
  getOwnerDashboard(@Request() req) {
    return this.storesService.getOwnerDashboard(req.user.id);
  }

  @Get()
  findAll(@Query() query: any, @Request() req) {
    return this.storesService.findAll(query, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }
}
