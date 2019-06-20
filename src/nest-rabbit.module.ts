import { DynamicModule, Global, Module } from '@nestjs/common';
import { NestRabbitService } from './nest-rabbit.service';
import { INRModuleConfiguration } from './interfaces';
import { NestRabbitMQConfigurationProvider, NestRabbitMQConnectionProvider, NestRabbitMQServiceProvider } from './constants';
import {  AmqpConnectionManager } from 'amqp-connection-manager';
import * as amqp from 'amqp-connection-manager';

@Global()
@Module({})
export class NestRabbitModule {

    static init(configuration: INRModuleConfiguration): DynamicModule {
        const rabbitConfigurationProvider = {
            provide: NestRabbitMQConfigurationProvider,
            useFactory: (): INRModuleConfiguration => {
                /**
                 * TODO: lean the configuration with default properties.
                 */
                return configuration;
            },
        };

        /**
         * Configure rabbit client by connecting to the
         */
        const rabbitConnectionProvider = {
            provide: NestRabbitMQConnectionProvider,
            useFactory: async (): Promise<any> => {
                return await amqp.connect(configuration.urls, configuration.options);
            },
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
