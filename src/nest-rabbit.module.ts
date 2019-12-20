import { DynamicModule, Global, Module } from '@nestjs/common';
import { NestRabbitService } from './nest-rabbit.service';
import { INRModuleConfiguration } from './interfaces';
import {
    NestRabbitMQConfigurationProvider,
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

        const rabbitConfigurationProvider = {
            provide: NestRabbitMQConfigurationProvider,
            useFactory: (configService: ConfigService): INRModuleConfiguration => configService.get<INRModuleConfiguration>('NRabbit', configuration),
            inject: [ConfigService]
        };

        /**
         * Configure rabbit client by connecting to the
         */
        const rabbitConnectionProvider = {
            provide: NestRabbitMQConnectionProvider,
            useFactory: async (configuration: INRModuleConfiguration): Promise<any> => amqp.connect(configuration.urls, configuration.options),
            inject: [NestRabbitMQConfigurationProvider]
        };

        const rabbitServiceProvider = {
            provide: NestRabbitMQServiceProvider,
            useFactory: async (connection: AmqpConnectionManager): Promise<NestRabbitService> => {
                return new NestRabbitService(connection);
            },
            inject: [NestRabbitMQConnectionProvider],
        };

        return {
            module: NestRabbitModule,
            providers: [rabbitConfigurationProvider, rabbitConnectionProvider, rabbitServiceProvider],
            exports: [rabbitServiceProvider],
        };
    }
}
