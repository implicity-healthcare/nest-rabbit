import { Injectable, Logger, LoggerService, OnModuleDestroy, Optional } from '@nestjs/common';
import { AmqpConnectionManager, ChannelWrapper, } from 'amqp-connection-manager';
import { INRSubscriptionConfiguration } from '../interfaces';
import { Replies } from 'amqplib';

@Injectable()
export class NestRabbitService implements OnModuleDestroy {
    private readonly channelManager: ChannelWrapper;
    private prefetchCapacity: number;

    constructor(
        private readonly connection: AmqpConnectionManager,
        @Optional()
        private readonly logger?: LoggerService,
    ) {
        /**
         * Default capacity to stack messages on this side.
         * Helps to maintain a fair dispatch among workers. see: https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
         */
        this.logger = logger || new Logger(NestRabbitService.name);
        this.prefetchCapacity = 1;
        this.channelManager = this.connection
            .createChannel({ json: true });
    }

    public setPrefetchCapacity(capacity: number) {
        if (capacity <= 0)
            return;

        this.prefetchCapacity = capacity;
    }

    public async onModuleDestroy(): Promise<any> {
        if (this.channelManager)
            return await this.channelManager.close();
    }

    public async subscribe(options: INRSubscriptionConfiguration): Promise<void> {
        const queueOptions = options.queue;
        const exchangeOptions = options.exchange;
        const consumptionOptions = options.consumption;
        const prefetchOptions = this.prefetchCapacity;

        this.channelManager.addSetup(async channel => {
            const queue: Replies.AssertQueue = await channel.assertQueue(queueOptions.name, queueOptions.options);

            this.logger?.log(`Queue "${queue.queue}" asserted.`);

            if (exchangeOptions) {
                /**
                 * Here we use queue and exchange .name in case the developer put empty string.
                 * If so, Rabbit will generate a random name.
                 */
                const exchange: Replies.AssertExchange = await channel.assertExchange(exchangeOptions.name, exchangeOptions.type, exchangeOptions.options);
                this.logger?.log(`Exchange "${exchange.exchange}" asserted.`);
            }

            await channel.prefetch(prefetchOptions);
            await channel.consume(queue.queue, consumptionOptions.handler.bind(null, channel), consumptionOptions.options)
        });
    }
}
