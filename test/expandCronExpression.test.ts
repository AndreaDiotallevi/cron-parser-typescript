import { expandCronExpression } from "../src/expandCronExpression"

describe("The expandCronExpression() function", () => {
    it("Should throw an error if cron string is not provided", () => {
        const f = () => {
            expandCronExpression("")
        }
        expect(f).toThrow(`Cron string not provided`)
    })
    it("Should throw an error if cron string does not contain 6 fields", () => {
        const f = () => {
            expandCronExpression("* * * * *")
        }
        expect(f).toThrow(`Invalid number of fields`)
    })
    it("Should throw an error if cron string is invalid", () => {
        const f = () => {
            expandCronExpression("-/ * * * * /command")
        }
        expect(f).toThrow("Invalid cron string")
    })
    // it("Should throw an error if the minutes field is out of range (0-59)", () => {
    //     const f = () => expandCronExpression("60 * * * * /command")
    //     expect(f).toThrow(`Invalid number of fields`)
    // })
})
