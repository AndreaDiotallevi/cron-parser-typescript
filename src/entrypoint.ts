// import { expandCronExpression } from "./expandCronExpression"
import { expandCronExpression2 } from "./old"

const cronString = process.argv[2]

expandCronExpression2({ cronString })
