import { expandCronExpression } from "./expandCronExpression"

const cronString = process.argv[2]

expandCronExpression({ cronString })
