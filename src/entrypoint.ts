import { expandCronExpression } from "./expandCronExpression"

const cronString = process.argv[2]

if (!cronString) {
    console.error("Error: No cron string provided")
    process.exit(1)
}

expandCronExpression(cronString)
