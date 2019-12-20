import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestRabbitServiceProvider } from './providers/nest-rabbit.service.provider';
import { NestRabbitConnectionProvider } from './providers/nest-rabbit.connection.provider';
import { NestRabbitService } from './services/nest-rabbit.service';

@Global()
@Module({
    imports: [
        ConfigService,
    ],
    providers: [
        NestRabbitConnectionProvider,
        NestRabbitServiceProvider,
    ],
    exports: [
        NestRabbitService,
    ]
})
export class NestRabbitModule {
}
