import { Module } from '@nestjs/common';
import { DebugSchemaController } from './debug.schema.controller';

@Module({
  controllers: [DebugSchemaController],
})
export class DebugModule {}
