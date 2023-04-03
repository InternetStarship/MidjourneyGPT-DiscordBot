/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

function parseInputString(input) {
  const typeRegex = /^(\w+)/
  const keyValueRegex = /\[(\w+)=([\w\s,]+)\]/g

  const typeMatch = input.match(typeRegex)
  const type = typeMatch ? typeMatch[1] : null

  const keyValuePairs = {}
  let match

  while ((match = keyValueRegex.exec(input)) !== null) {
    const key = match[1]
    const value = match[2]
    keyValuePairs[key] = value
  }

  return { type, ...keyValuePairs }
}

module.exports = parseInputString
