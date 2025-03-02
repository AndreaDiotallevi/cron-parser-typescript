# Cron Parser Typescript

## Description

This project is a command line script that parses a cron string and expands each field to show the times at which it will run.

From the requirements: _You should only consider the standard cron format with five time fields (minute, hour, day of month, month, and day of week) plus a command, and you do not need to handle the special time strings such as "@yearly". The input will be on a single line._

For example:

```
*/15 0 1,15 * 1-5 /usr/bin/find
```

This should output:

```
minute         0 15 30 45
hour           0
day of month   1 15
month          1 2 3 4 5 6 7 8 9 10 11 12
day of week    1 2 3 4 5
command        /usr/bin/find
```

## How to use

I used TypeScript because I am most comfortable with it.

- Install dependencies with:

```
npm install
```

- Run the script `expand-cron-expression` from the command line, followed by the input string (I used `ts-node` to directly execute TypeScript on Node.js without precompiling):

```
npm run expand-cron-expression "*/15 0 1,15 * 1-5 /usr/bin/find"
```

## How to test

- Run from the command line: `npm run test`

```
 PASS  test/expandCronExpression.test.ts
  The validateCronStringParts() function
    ✓ Should throw an error if cron string is not provided (6 ms)
    ✓ Should throw an error if cron string does not contain 6 fields
    ✓ Should return the unparsed fields and the command
  The expandFields() function
    ✓ Should expand correctly the times of a wild card field (*) (1 ms)
    ✓ Should expand correctly the times of an integer field (simple number like 2)
    ✓ Should expand correctly the times of an increment field (/)
    ✓ Should expand correctly the times of a list field (,)
    ✓ Should expand correctly the times of a range field (-)
    ✓ Should throw an 'Invalid field' error if integer field is out of range (1 ms)
    ✓ Should throw an 'Invalid field' error if increment field is out of range
    ✓ Should throw an 'Invalid field' error if list field is out of range
    ✓ Should throw an 'Invalid field' error if range field is out of range
```

## Technical notes

- I used a functional programming style for this challenge because I thought it would work well for transforming data (e.g., using the `map` function), rather than thinking in terms of objects.

- I divided the logic into three parts:
    - Validate the Cron string parts:
        - Error: `Please provide an input cron string`
        - Error: `Please provide 5 fields and a command`
        - Success: It returns the unparsed fields and the command (`{ unparsedFields: string[]; command: string }[]`)
    - Expand each field to the correct times:
        - Error: `Invalid field`
        - Success: It returns an array of expanded fields (`{ name: string; times: Set<number> }`)
    - Print the formatted table:
        - Success: It formats the expanded fields + command in a table
