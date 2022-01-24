export async function main(event: any) {
    return {
        body: JSON.stringify({ message: 'SUCCESS 🎉' }),
        headers: { 'Content-Type': 'text/json' },
        statusCode: 200,
    };
}
