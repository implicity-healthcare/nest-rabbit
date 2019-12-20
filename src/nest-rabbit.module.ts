import { DynamicModule, Global, Module } from '@nestjs/common';
import { NestRabbitService } from './nest-rabbit.service';
import { INRModuleConfiguration } from './interfaces';
import {
    NestRabbitMQConnectionProvider,
    NestRabbitMQServiceProvider
} from './constants';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import * as amqp from 'amqp-connection-manager';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({})
export class NestRabbitModule {

    static init(configuration?: INRModuleConfiguration): DynamicModule {
        /**
         * Configure rabbit client by connecting to the
         */
        const rabbitConnectionProvider = {
            provide: NestRabbitMQConnectionProvider,
            inject: [
                ConfigService
            ],
            useFactory: async (configService: ConfigService): Promise<any> => {
                const options = configService.get<INRModuleConfiguration>('NRabbit', configuration);
                return amqp.connect(options.urls, options.options)
            }
        };

        const rabbitServiceProvider = {
            provide: NestRabbitMQServiceProvider,
            inject: [
                NestRabbitMQConnectionProvider
            ],
            useFactory: async (connection: AmqpConnectionManager): Promise<NestRabbitService> => new NestRabbitService(connection),
        };

        return {
            module: NestRabbitModule,
            imports: [
                ConfigService,
            ],
            providers: [rabbitConnectionProvider, rabbitServiceProvider],
            exports: [rabbitServiceProvider],
        };
    }
}
