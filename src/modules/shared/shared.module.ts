import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';

const providers = [
  ConfigService,
]

@Module({
  imports: [HttpModule],
  providers: [...providers,],
  exports: [HttpModule, ...providers]
})
export class SharedModule {}
