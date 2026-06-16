import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { UserRole } from '../users/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  submit(@Request() req, @Body() dto: SubmitRatingDto) {
    return this.ratingsService.submitOrUpdate(req.user.id, dto.storeId, dto.value);
  }
}
