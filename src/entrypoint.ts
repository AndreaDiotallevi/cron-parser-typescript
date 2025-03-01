import { expandCronExpression } from "./expandCronExpression"

const cronString = process.argv[2]

if (!cronString) {
    console.error("Error: No CRON string provided")
    process.exit(1)
}

expandCronExpression(cronString)
