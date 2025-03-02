type FieldProperties = {
    name: string
    min: number
    max: number
}

type ExpandedField = {
    name: string
    times: number[]
}

const FIELDS_PROPERTIES: FieldProperties[] = [
    { name: "minute", min: 0, max: 59 },
    { name: "hour", min: 0, max: 23 },
    { name: "day of month", min: 1, max: 31 },
    { name: "month", min: 1, max: 12 },
    { name: "day of week", min: 0, max: 6 },
]

export const expandCronExpression = ({
    cronString,
}: {
    cronString: string
}) => {
    // Validate cron string parts
    if (!cronString) {
        throw new Error(`Please provide an input cron string`)
    }

    const parts = cronString.split(" ")

    if (parts.length != 6) {
        throw new Error(`Please provide 5 fields and a command`)
    }

    const [...unparsedFields] = parts.slice(0, 5)
    const command = parts[parts.length - 1]

    // Expand fields
    const expandedFields: ExpandedField[] = unparsedFields.map((field, i) => {
        const { name, min, max } = FIELDS_PROPERTIES[i]
        const times: ExpandedField["times"] = []

        if (field == "*") {
            for (let i = min; i <= max; i++) {
                times.push(i)
            }

            return { name, times }
        }

        const integerRegex = new RegExp("^\d+$")
        if (integerRegex.test(field)) {
            return { name, times: [parseInt(field)] }
        }

        const incrementRegexWithWildCard = new RegExp("^\*/\d+$")
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

        const incrementRegex = new RegExp("^\d+/\d+$")
        if (incrementRegex.test(field)) {
            const [startString, incrementString] = field.split("/")
            const start = parseInt(startString)
            const increment = parseInt(incrementString)
            let current = start
            times.push(current)

            while (current + increment <= max) {
                current += increment
                times.push(current)
            }

            return { name, times }
        }

        const listRegex = new RegExp("^\d+(,\d+)*$")
        if (listRegex.test(field)) {
            const listString = field.split(",")

            for (const str of listString) {
                times.push(parseInt(str))
            }

            return { name, times }
        }

        const rangeRegex = new RegExp("^\d+-\d+$")
        if (rangeRegex.test(field)) {
            const [startString, endString] = field.split("-")
            const start = parseInt(startString)
            const end = parseInt(endString)

            for (let i = start; i <= end; i++) {
                times.push(i)
            }

            return { name, times }
        }

        throw new Error("Invalid cron field: " + field)
    })

    // Print fields
    expandedFields.forEach((field) => {
        console.log(`${field.name.padEnd(14, " ")} ${field.times.join(" ")}`)
    })
    console.log(`${"command".padEnd(14, " ")} ${command}`)
}
