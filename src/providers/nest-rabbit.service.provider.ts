import { NestRabbitService } from '..';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import { NestRabbitConnection } from '../constants';

export const NestRabbitServiceProvider =  {
    provide: NestRabbitService,
    inject: [
        NestRabbitConnection
    ],
    useFactory: async (connection: AmqpConnectionManager): Promise<NestRabbitService> => new NestRabbitService(connection),
};
