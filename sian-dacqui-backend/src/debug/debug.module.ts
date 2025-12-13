import { Module } from '@nestjs/common';
import { DebugSchemaController } from './debug.schema.controller';
import { DebugController } from './debug.controller';

@Module({
  controllers: [DebugSchemaController, DebugController],
})
export class DebugModule {}
