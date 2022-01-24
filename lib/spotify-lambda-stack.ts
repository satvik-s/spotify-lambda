import {
    CorsHttpMethod,
    HttpApi,
    HttpMethod,
    PayloadFormatVersion,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
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
            functionName: 'spotify-now-playing',
            handler: 'now-playing.main',
            logRetention: RetentionDays.THREE_DAYS,
            memorySize: 128,
            runtime: Runtime.NODEJS_14_X,
            timeout: Duration.seconds(2),
        });

        const apiGateway = new HttpApi(this, 'spotify', {
            apiName: 'spotify',
            corsPreflight: {
                allowMethods: [CorsHttpMethod.GET],
                allowOrigins: ['*'],
                maxAge: Duration.minutes(10),
            },
            createDefaultStage: false,
            description: 'spotify api gateway',
            disableExecuteApiEndpoint: false,
        });

        apiGateway.addStage('v1 stage', {
            autoDeploy: true,
            stageName: 'v1',
        });

        const nowPlayingLambdaIntegration = new HttpLambdaIntegration(
            'spotify-now-playing-lambda-integration',
            lambdaFunction,
            {
                payloadFormatVersion: PayloadFormatVersion.VERSION_2_0,
            },
        );

        apiGateway.addRoutes({
            integration: nowPlayingLambdaIntegration,
            methods: [HttpMethod.GET],
            path: '/now-playing',
        });
    }
}
