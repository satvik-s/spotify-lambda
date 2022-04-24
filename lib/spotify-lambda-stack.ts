import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
    Code,
    Function,
    FunctionUrlAuthType,
    HttpMethod,
    Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

export class SpotifyLambdaStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // 👇 lambda function definition
        const lambdaFunction = new Function(this, 'spotify-now-playing', {
            code: Code.fromAsset(path.join(__dirname, '/../dist')),
            currentVersionOptions: {
                removalPolicy: RemovalPolicy.DESTROY,
            },
            description: 'spotify now playing lambda',
            environment: {
                CLIENT_ID: process.env.SPOTIFY_BLOG_APP_CLIENT_ID ?? '',
                CLIENT_SECRET: process.env.SPOTIFY_BLOG_APP_CLIENT_SECRET ?? '',
                REFRESH_TOKEN: process.env.SPOTIFY_BLOG_APP_REFRESH_TOKEN ?? '',
            },
            functionName: 'spotify-now-playing',
            handler: 'now-playing.main',
            logRetention: RetentionDays.THREE_DAYS,
            memorySize: 128,
            runtime: Runtime.NODEJS_14_X,
            timeout: Duration.seconds(2),
        });

        lambdaFunction.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            cors: {
                allowedMethods: [HttpMethod.GET],
                allowedOrigins: ['*'],
                maxAge: Duration.minutes(1),
            },
        });
    }
}
