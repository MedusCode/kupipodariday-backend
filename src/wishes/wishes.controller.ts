import { Controller } from '@nestjs/common';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}
}
