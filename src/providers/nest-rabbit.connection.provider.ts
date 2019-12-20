import { ConfigService } from '@nestjs/config';
import { INRModuleConfiguration } from '../interfaces';
import { Provider } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { NestRabbitConnection } from '../constants';

export const NestRabbitConnectionProvider = {
    provide: NestRabbitConnection,
    inject: [
        ConfigService
    ],
    useFactory: async (configService: ConfigService): Promise<any> => {
        const configuration  = configService.get<INRModuleConfiguration>('NRabbit');
        if (!configuration || !configuration.urls)
            throw new Error('Missing configuration from @nestjs/config. Please register Nest-Rabbit configuration under the NRabbit namespace');

        return amqp.connect(configuration.urls, configuration.options)
    }
} as Provider;
