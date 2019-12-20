import { AmqpConnectionManager } from 'amqp-connection-manager';
import { Provider } from '@nestjs/common';
import { NestRabbitService } from '../services/nest-rabbit.service';
import { NestRabbitConnection } from '../constants';

export const NestRabbitServiceProvider: Provider =  {
    provide: NestRabbitService,
    inject: [
        NestRabbitConnection
    ],
    useFactory: async (connection: AmqpConnectionManager): Promise<NestRabbitService> => new NestRabbitService(connection),
};
