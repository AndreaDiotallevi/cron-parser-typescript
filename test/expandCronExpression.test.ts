import {
    expandFields,
    validateCronStringParts,
} from "../src/expandCronExpression"

describe("The validateCronStringParts() function", () => {
    it("Should throw an error if cron string is not provided", () => {
        const f = () => {
            validateCronStringParts({ cronString: "" })
        }
        expect(f).toThrow(`Please provide an input cron string`)
    })
    it("Should throw an error if cron string does not contain 6 fields", () => {
        const f = () => {
            validateCronStringParts({ cronString: "* * * * *" })
        }
        expect(f).toThrow(`Please provide 5 fields and a command`)
    })
    it("Should return the unparsed fields and the command", () => {
        const { unparsedFields, command } = validateCronStringParts({
            cronString: "1 2 3 4 5 /command",
        })
        expect(unparsedFields).toHaveLength(5)
        expect(unparsedFields[0]).toEqual("1")
        expect(unparsedFields[1]).toEqual("2")
        expect(unparsedFields[2]).toEqual("3")
        expect(unparsedFields[3]).toEqual("4")
        expect(unparsedFields[4]).toEqual("5")
        expect(command).toEqual("/command")
    })
})

describe("The expandFields() function", () => {
    it("Should expand correctly the times of a wild card field (*)", () => {
        const fields = expandFields({
            unparsedFields: ["*"],
            fieldProperties: [{ name: "test", min: 0, max: 5 }],
        })
        expect(fields).toEqual([{ name: "test", times: [0, 1, 2, 3, 4, 5] }])
    })
    it("Should expand correctly the times of an integer field (simple number like 2)", () => {
        const fields = expandFields({
            unparsedFields: ["3"],
            fieldProperties: [{ name: "test", min: 0, max: 5 }],
        })
        expect(fields).toEqual([{ name: "test", times: [3] }])
    })
    it("Should expand correctly the times of an increment field (/)", () => {
        const fields = expandFields({
            unparsedFields: ["1/2"],
            fieldProperties: [{ name: "test", min: 0, max: 5 }],
        })
        expect(fields).toEqual([{ name: "test", times: [1, 3, 5] }])
        const fields2 = expandFields({
            unparsedFields: ["*/2"],
            fieldProperties: [{ name: "test", min: 0, max: 5 }],
        })
        expect(fields2).toEqual([{ name: "test", times: [0, 2, 4] }])
    })
    it("Should expand correctly the times of a list field (,)", () => {
        const fields = expandFields({
            unparsedFields: ["1,2,4"],
            fieldProperties: [{ name: "test", min: 0, max: 5 }],
        })
        expect(fields).toEqual([{ name: "test", times: [1, 2, 4] }])
    })
    it("Should expand correctly the times of a range field (-)", () => {
        const fields = expandFields({
            unparsedFields: ["2-4"],
            fieldProperties: [{ name: "test", min: 0, max: 5 }],
        })
        expect(fields).toEqual([{ name: "test", times: [2, 3, 4] }])
    })
    it("Should throw an 'Invalid field' error if integer field is out of range", () => {
        const f = () => {
            expandFields({
                unparsedFields: ["8"],
                fieldProperties: [{ name: "test", min: 0, max: 5 }],
            })
        }
        expect(f).toThrow(`Invalid field: 8`)
    })
    it("Should throw an 'Invalid field' error if increment field is out of range", () => {
        const f = () => {
            expandFields({
                unparsedFields: ["60/99"],
                fieldProperties: [{ name: "test", min: 0, max: 5 }],
            })
        }
        expect(f).toThrow(`Invalid field: 60/99`)
    })
    it("Should throw an 'Invalid field' error if increment value is zero", () => {
        const f1 = () => {
            expandFields({
                unparsedFields: ["*/0"],
                fieldProperties: [{ name: "test", min: 0, max: 5 }],
            })
        }
        expect(f1).toThrow(`Invalid field: */0`)
        const f2 = () => {
            expandFields({
                unparsedFields: ["1/0"],
                fieldProperties: [{ name: "test", min: 0, max: 5 }],
            })
        }
        expect(f2).toThrow(`Invalid field: 1/0`)
    })
    it("Should throw an 'Invalid field' error if list field is out of range", () => {
        const f = () => {
            expandFields({
                unparsedFields: ["1,7"],
                fieldProperties: [{ name: "test", min: 0, max: 5 }],
            })
        }
        expect(f).toThrow(`Invalid field: 1,7`)
    })
    it("Should throw an 'Invalid field' error if range field is out of range", () => {
        const f = () => {
            expandFields({
                unparsedFields: ["1-7"],
                fieldProperties: [{ name: "test", min: 0, max: 5 }],
            })
        }
        expect(f).toThrow(`Invalid field: 1-7`)
    })
    it("Should throw an 'Invalid field' error if range start is greater than end", () => {
        const f = () => {
            expandFields({
                unparsedFields: ["7-1"],
                fieldProperties: [{ name: "test", min: 0, max: 5 }],
            })
        }
        expect(f).toThrow(`Invalid field: 7-1`)
    })
    it("Should throw an 'Invalid field' error if field has an unrecognised format", () => {
        const f = () => {
            expandFields({
                unparsedFields: ["7-1,8"],
                fieldProperties: [{ name: "test", min: 0, max: 5 }],
            })
        }
        expect(f).toThrow(`Invalid field: 7-1,8`)
    })
})
