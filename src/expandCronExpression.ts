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
        throw new Error(`Please provide an input string`)
    }

    const parts = cronString.split(" ")

    if (parts.length != 6) {
        throw new Error(`Please provide 5 fields and a command`)
    }

    const [...unparsedFields] = parts.slice(0, 5)
    const command = parts[parts.length - 1]

    console.log(unparsedFields)
    console.log(command)

    const parsedFields: ParsedField[] = unparsedFields.map((field) => {
        console.log(field)
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
        if (Number.isInteger(parseInt(field))) {
            console.log("integer")
            return { format: "", factors: [parseInt(field)] }
        }
        console.log("here")
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
    const factors = field.split(format).map((factor) => parseFactor({ factor }))

    return { format, factors }
}

const parseFactor = ({ factor }: { factor: string }) => {
    if (factor == "*") {
        return factor
    }

    if (Number.isInteger(parseInt(factor))) {
        return parseInt(factor)
    }

    throw new Error(`Invalid cron string`)
}

// 1. extract fields
// 2. validate fields
// 3. resolve fields
