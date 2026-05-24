import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';

@Module({
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
