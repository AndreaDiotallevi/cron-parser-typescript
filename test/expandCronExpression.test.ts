import { expandCronExpression } from "../src/expandCronExpression"

describe("The expandCronExpression() function", () => {
    it("Should throw an error if cron string does not contain 6 fields", () => {
        const f = () => expandCronExpression("")
        expect(f).toThrow(`Invalid number of fields`)
    })
})
