import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { S3Service } from './s3/s3/s3.service';

const providers = [
  ConfigService,
  S3Service,
]

@Module({
  imports: [HttpModule],
  providers: [...providers, ],
  exports: [HttpModule, ...providers]
})
export class SharedModule {}
