import { Module } from '@nestjs/common';
import { StudiosService } from './studios.service';

@Module({
  providers: [StudiosService],
  exports: [StudiosService],
})
export class StudiosModule {}
