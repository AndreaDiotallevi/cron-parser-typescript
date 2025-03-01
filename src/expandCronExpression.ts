export const expandCronExpression = (cronString: string) => {
    const fields = cronString.split(" ")

    if (fields.length != 6) {
        throw new Error(`Invalid number of fields`)
    }
}

// 1. extract fields
// 2. validate fields
// 3. resolve fields
