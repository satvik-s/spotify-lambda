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

        const nowPlayingLambdaFunction = new Function(
            this,
            'spotify-now-playing',
            {
                code: Code.fromAsset(
                    path.join(__dirname, '/../dist-now-playing'),
                ),
                currentVersionOptions: {
                    removalPolicy: RemovalPolicy.DESTROY,
                },
                description: 'spotify now playing lambda',
                environment: {
                    CLIENT_ID: process.env.SPOTIFY_BLOG_APP_CLIENT_ID ?? '',
                    CLIENT_SECRET:
                        process.env.SPOTIFY_BLOG_APP_CLIENT_SECRET ?? '',
                    REFRESH_TOKEN:
                        process.env.SPOTIFY_BLOG_APP_REFRESH_TOKEN ?? '',
                },
                functionName: 'spotify-now-playing',
                handler: 'now-playing.main',
                logRetention: RetentionDays.THREE_DAYS,
                memorySize: 128,
                runtime: Runtime.NODEJS_14_X,
                timeout: Duration.seconds(2),
            },
        );

        nowPlayingLambdaFunction.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            cors: {
                allowedMethods: [HttpMethod.GET],
                allowedOrigins: ['*'],
                maxAge: Duration.minutes(1),
            },
        });

        const topTracksLambdaFunction = new Function(
            this,
            'spotify-top-tracks',
            {
                code: Code.fromAsset(
                    path.join(__dirname, '/../dist-top-tracks'),
                ),
                currentVersionOptions: {
                    removalPolicy: RemovalPolicy.DESTROY,
                },
                description: 'spotify now playing lambda',
                environment: {
                    CLIENT_ID: process.env.SPOTIFY_BLOG_APP_CLIENT_ID ?? '',
                    CLIENT_SECRET:
                        process.env.SPOTIFY_BLOG_APP_CLIENT_SECRET ?? '',
                    REFRESH_TOKEN:
                        process.env.SPOTIFY_BLOG_APP_REFRESH_TOKEN ?? '',
                },
                functionName: 'spotify-top-tracks',
                handler: 'top-tracks.main',
                logRetention: RetentionDays.THREE_DAYS,
                memorySize: 128,
                runtime: Runtime.NODEJS_14_X,
                timeout: Duration.seconds(2),
            },
        );

        topTracksLambdaFunction.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            cors: {
                allowedMethods: [HttpMethod.GET],
                allowedOrigins: ['*'],
                maxAge: Duration.minutes(1),
            },
        });
    }
}
