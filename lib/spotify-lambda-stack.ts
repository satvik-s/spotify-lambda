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
            functionName: 'spotify-now-playing',
            handler: 'now-playing.main',
            logRetention: RetentionDays.THREE_DAYS,
            memorySize: 128,
            runtime: Runtime.NODEJS_14_X,
            timeout: Duration.seconds(2),
            currentVersionOptions: {
                removalPolicy: RemovalPolicy.DESTROY,
            },
        });
    }
}
