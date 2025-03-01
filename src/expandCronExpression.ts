type Field = {
    name: string
    min: number
    max: number
}

const fields: Field[] = [
    { name: "minute", min: 0, max: 59 },
    { name: "hour", min: 0, max: 23 },
    { name: "day of month", min: 1, max: 31 },
    { name: "month", min: 1, max: 12 },
    { name: "day of week", min: 0, max: 6 },
]

type Format = "/" | "," | "-" | "*" | ""

type ParsedField = {
    format: Format
    factors: (number | "*")[]
}

export const expandCronExpression = (cronString: string) => {
    if (!cronString) {
        throw new Error(`Cron string not provided`)
    }

    const fields = cronString.split(" ")
    console.log(fields)

    if (fields.length != 6) {
        throw new Error(`Invalid number of fields`)
    }

    const parsedFields: ParsedField[] = fields.map((field) => {
        if (field.includes("/")) {
            return parseField({ format: "/", field })
        }
        if (field.includes(",")) {
            return parseField({ format: ",", field })
        }
        if (field.includes("-")) {
            return parseField({ format: "-", field })
        }
        if (field == "*") {
            return { format: "*", factors: [] }
        }
        if (Number.isInteger(field)) {
            return parseField({ format: "", field })
        }
        throw new Error(`Invalid cron string`)
    })

    console.log(parsedFields)
}

const parseField = ({
    format,
    field,
}: {
    format: Format
    field: string
}): ParsedField => {
    const factors = field.split(format).map((item) => {
        console.log(item)
        if (item == "*") {
            return item
        }

        if (Number.isInteger(item)) {
            return parseInt(item)
        }

        throw new Error(`Invalid cron string`)
    })
    console.log("after")

    return { format, factors }
}

// 1. extract fields
// 2. validate fields
// 3. resolve fields
