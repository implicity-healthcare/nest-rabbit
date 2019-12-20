import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestRabbitServiceProvider } from './providers/nest-rabbit.service.provider';
import { NestRabbitConnectionProvider } from './providers/nest-rabbit.connection.provider';

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
        NestRabbitServiceProvider,
    ]
})
export class NestRabbitModule {
}
