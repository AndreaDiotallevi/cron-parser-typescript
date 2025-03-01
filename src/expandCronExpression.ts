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

type ExpandedField = {
    name: string
    output: number[]
}

export const expandCronExpression = (cronString: string) => {
    // Split fields
    if (!cronString) {
        throw new Error(`Please provide an input string`)
    }

    const parts = cronString.split(" ")

    if (parts.length != 6) {
        throw new Error(`Please provide 5 fields and a command`)
    }

    const [...unparsedFields] = parts.slice(0, 5)
    const command = parts[parts.length - 1]

    // console.log(unparsedFields)
    // console.log(command)

    // Parse fields
    const parsedFields: ParsedField[] = unparsedFields.map((field) => {
        // console.log(field)
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
            return { format: "", factors: [parseInt(field)] }
        }
        throw new Error(`Invalid cron string`)
    })

    // console.log(parsedFields)

    // Validate fields
    for (let i = 0; i < parsedFields.length; i++) {
        if (!isRangeValid({ parsedField: parsedFields[i], index: i })) {
            throw new Error("Out of range")
        }
    }

    // Expand fields
    const expandedFields: ExpandedField[] = []
    for (let i = 0; i < parsedFields.length; i++) {
        const parsedField = parsedFields[i]
        const output: number[] = []
        if (parsedField.format == "") {
            if (parsedField.factors[0] == "*") {
                throw new Error("Data quality issue")
            }
            output.push(parsedField.factors[0])
            expandedFields.push({ name: fields[i].name, output })
            continue
        }

        if (parsedField.format == "/") {
            const start =
                parsedField.factors[0] == "*" ? 0 : parsedField.factors[0]

            const increment = parsedField.factors[1]

            if (increment == "*") {
                throw new Error("Data quality issue")
            }

            output.push(start)

            let end = 0

            while (end + increment <= fields[i].max) {
                output.push(end + increment)
                end += increment
            }
            expandedFields.push({ name: fields[i].name, output })
            continue
        }

        if (parsedField.format == ",") {
            for (const factor of parsedField.factors) {
                if (factor == "*") {
                    throw new Error("Data quality issue")
                }
                output.push(factor)
            }
            expandedFields.push({ name: fields[i].name, output })
            continue
        }

        if (parsedField.format == "*") {
            for (let j = fields[i].min; j <= fields[i].max; j++) {
                output.push(j)
            }
            expandedFields.push({ name: fields[i].name, output })
            continue
        }

        if (parsedField.format == "-") {
            if (
                parsedField.factors[0] == "*" ||
                parsedField.factors[1] == "*"
            ) {
                throw new Error("Data quality issue")
            }

            for (
                let j = parsedField.factors[0];
                j <= parsedField.factors[1];
                j++
            ) {
                output.push(j)
            }
            expandedFields.push({ name: fields[i].name, output })
            continue
        }
    }

    // console.log(expandedFields)

    // Print fields
    for (let i = 0; i < expandedFields.length; i++) {
        console.log(
            `${fields[i].name.padEnd(14, " ")} ${expandedFields[i].output.join(" ")}`,
        )
    }
    console.log(`${"command".padEnd(14, " ")} ${command}`)
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

const parseFactor = ({ factor }: { factor: string }): number | "*" => {
    if (factor == "*") {
        return factor
    }

    if (Number.isInteger(parseInt(factor))) {
        return parseInt(factor)
    }

    throw new Error(`Invalid cron string`)
}

const isRangeValid = ({
    parsedField,
    index,
}: {
    parsedField: ParsedField
    index: number
}): boolean => {
    const fieldRanges = fields[index]

    for (const factor of parsedField.factors) {
        if (factor == "*") continue
        if (factor < fieldRanges.min || factor > fieldRanges.max) {
            return false
        }
    }

    return true
}
