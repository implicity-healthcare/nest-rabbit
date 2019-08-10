# NestRabbit

## Installation

```
yarn add @implicity/nest-rabbit
```

or

```
npm install --save @implicity/nest-rabbit
```

## Usage

### Initialisation
NestRabbit is based on [AMQPConnectionManager](https://github.com/benbria/node-amqp-connection-manager).
To have a detailed understanding about how to configure the library feel free to check it out.

```typescript
...

@Module({
    imports: [
      ...
        NestRabbitModule.init({
            urls: [
                process.env.RABBIT_MQ_URI || `amqp://user:passwd@localhost:5672`,
            ],
            options: {},
        }),

    ],
})
export class ApplicationModule {}
}

```
### Injection and communication
NestRabbit takes benefit from Nest Dependency Injection

```typescript
@Injectable()
export class WatcherService {
    constructor(
      @Inject(NestRabbitMQServiceProvider) protected readonly rabbitService: NestRabbitService,
    ) {}

    public async onMessageReceived(channel: Channel, message: Message): Promise<void> {
        const content = message.content.toString();
        console.log(`> message received ${ content }`);
        return channel.ack(message);
    }

    public async setup(event: string, handler: (channel: any, message: any) => Promise<void>): Promise<void> {
        const queue = { name: event };
        const consumption = { handler: this.onMessageReceived, options: { noAck: false } };

        await this.rabbitService
            .subscribe({ queue, consumption });
    }
}
```
