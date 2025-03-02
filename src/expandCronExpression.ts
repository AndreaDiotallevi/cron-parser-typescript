type FieldProperties = {
    name: string
    min: number
    max: number
}

type ExpandedField = {
    name: string
    times: number[]
}

export const expandCronExpression = ({
    cronString,
}: {
    cronString: string
}) => {
    const { unparsedFields, command } = validateCronStringParts({ cronString })

    const expandedFields = expandFields({
        unparsedFields,
        fieldProperties: [
            { name: "minute", min: 0, max: 59 },
            { name: "hour", min: 0, max: 23 },
            { name: "day of month", min: 1, max: 31 },
            { name: "month", min: 1, max: 12 },
            { name: "day of week", min: 0, max: 6 },
        ],
    })

    printFormattedTable({ expandedFields, command })
}

export const validateCronStringParts = ({
    cronString,
}: {
    cronString: string
}): { unparsedFields: string[]; command: string } => {
    if (!cronString) {
        throw new Error(`Please provide an input cron string`)
    }

    const parts = cronString.split(" ")

    if (parts.length != 6) {
        throw new Error(`Please provide 5 fields and a command`)
    }

    const [...unparsedFields] = parts.slice(0, 5)
    const command = parts[parts.length - 1]

    return { unparsedFields, command }
}

export const expandFields = ({
    unparsedFields,
    fieldProperties,
}: {
    unparsedFields: string[]
    fieldProperties: FieldProperties[]
}): ExpandedField[] => {
    return unparsedFields.map((field, i) => {
        const { name, min, max } = fieldProperties[i]
        const times: ExpandedField["times"] = []

        if (field == "*") {
            for (let i = min; i <= max; i++) {
                times.push(i)
            }
            return { name, times }
        }

        const integerRegex = new RegExp("^\\d+$")
        if (integerRegex.test(field)) {
            const time = parseInt(field)
            if (time < min || time > max) {
                throw new Error("Invalid field: " + field)
            }
            return { name, times: [time] }
        }

        const incrementRegexWithWildCard = new RegExp("^\\*/\\d+$")
        if (incrementRegexWithWildCard.test(field)) {
            const [_, incrementString] = field.split("/")
            const increment = parseInt(incrementString)
            let current = 0
            times.push(current)

            while (current + increment <= max) {
                current += increment
                times.push(current)
            }

            return { name, times }
        }

        const incrementRegex = new RegExp("^\\d+/\\d+$")
        if (incrementRegex.test(field)) {
            const [startString, incrementString] = field.split("/")
            const start = parseInt(startString)
            const increment = parseInt(incrementString)
            if (start < min || start > max) {
                throw new Error("Invalid field: " + field)
            }
            let current = start
            times.push(current)

            while (current + increment <= max) {
                current += increment
                times.push(current)
            }

            return { name, times }
        }

        const listRegex = new RegExp("^\\d+(,\\d+)*$")
        if (listRegex.test(field)) {
            const listString = field.split(",")

            for (const str of listString) {
                const time = parseInt(str)
                if (time < min || time > max) {
                    throw new Error("Invalid field: " + field)
                }
                times.push(time)
            }

            return { name, times }
        }

        const rangeRegex = new RegExp("^\\d+-\\d+$")
        if (rangeRegex.test(field)) {
            const [startString, endString] = field.split("-")
            const start = parseInt(startString)
            const end = parseInt(endString)

            if (start > end) {
                throw new Error("Invalid field: " + field)
            }

            for (let i = start; i <= end; i++) {
                if (i < min || i > max) {
                    throw new Error("Invalid field: " + field)
                }
                times.push(i)
            }

            return { name, times }
        }

        throw new Error("Invalid field: " + field)
    })
}

export const printFormattedTable = ({
    expandedFields,
    command,
}: {
    expandedFields: ExpandedField[]
    command: string
}): void => {
    expandedFields.forEach((field) => {
        console.log(`${field.name.padEnd(14, " ")} ${field.times.join(" ")}`)
    })
    console.log(`${"command".padEnd(14, " ")} ${command}`)
}
