import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StencilController } from './stencil.controller';
import { StencilService } from './stencil.service';
import { StencilAiService } from './stencil-ai.service';
import { StencilStorage } from './stencil.storage';

@Module({
  imports: [AuthModule],
  controllers: [StencilController],
  providers: [StencilService, StencilAiService, StencilStorage],
})
export class StencilModule {}
