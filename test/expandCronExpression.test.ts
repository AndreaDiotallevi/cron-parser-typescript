import { expandCronExpression } from "../src/expandCronExpression"

describe("The expandCronExpression() function", () => {
    // it("Should throw an error if cron string is not provided", () => {
    //     const f = () => {
    //         expandCronExpression("")
    //     }
    //     expect(f).toThrow(`Please provide an input string`)
    // })
    // it("Should throw an error if cron string does not contain 6 fields", () => {
    //     const f = () => {
    //         expandCronExpression("* * * * *")
    //     }
    //     expect(f).toThrow(`Please provide 5 fields and a command`)
    // })
    // it("Should throw an error if cron string is invalid", () => {
    //     const f1 = () => {
    //         expandCronExpression("-/ * * * * /command")
    //     }
    //     expect(f1).toThrow("Invalid cron string")
    // })
    // it("Should throw an error if the minutes field is out of range (0-59)", () => {
    //     const f = () => expandCronExpression("60 * * * * /command")
    //     expect(f).toThrow(`Minute field out of range`)
    // })
    it("Should throw an error if the minutes field is out of range (0-59)", () => {
        const f = () => expandCronExpression("*/15 4 * * * /command")
        expect(f).toThrow(`Minute field out of range`)
    })
})
