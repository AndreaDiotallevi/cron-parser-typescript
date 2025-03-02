# Cron Parser Typescript

## Description

This project is a command line script that parses a cron string and expands each field to show the times at which it will run.

More from the requirements: _You should only consider the standard cron format with five time fields (minute, hour, day of month, month, and day of week) plus a command, and you do not need to handle the special time strings such as "@yearly". The input will be on a single line._

For example:

```
*/15 0 1,15 * 1-5 /usr/bin/find
```

Should output:

```
minute         0 15 30 45
hour           0
day of month   1 15
month          1 2 3 4 5 6 7 8 9 10 11 12
day of week    1 2 3 4 5
command        /usr/bin/find
```

## How to use

I used TypeScript since it's the language I am the most comfortable with.

- Install dependencies with

```
npm install
```

- Run from the command line the script `expand-cron-expression` followed by the input string (I have used `ts-node` to directly execute TypeScript on Node.js without precompiling):

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

TBC
