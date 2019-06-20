import { Channel, ConfirmChannel, ConsumeMessage, Message, Options } from 'amqplib';
import { AmqpConnectionManagerOptions } from 'amqp-connection-manager';

export interface INRModuleConfiguration {
    urls: string[];
    options?: AmqpConnectionManagerOptions;
}

export interface INRQueueConfiguration {
    name: string;
    options?: Options.AssertQueue;
}

export interface INRExchangeConfiguration {
    name: string;
    patterns?: string[];
    type: 'topic' | 'direct' | 'fanout' | 'headers';
    options?: Options.AssertQueue;
}

export interface INRConsumptionConfiguration {
    options?: Options.Consume;
    handler: (channel: ConfirmChannel, message: ConsumeMessage) => void,
}

export interface INRSubscriptionConfiguration {
    queue?: INRQueueConfiguration;
    exchange?: INRExchangeConfiguration;
    consumption: INRConsumptionConfiguration
}

export interface INRMessageQueueHandler {
    queue: string
    handler: (channel: Channel, message: Message) => Promise<void>
}
