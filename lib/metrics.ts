import type { ParsedRow } from "./csvParser"

export interface OverallMetrics {
  average: number
  min: number
  max: number
  total: number
  totalEntries: number
}

export interface PersonMetrics {
  average: number
  min: number
  max: number
  total: number
  entries: number
}

export interface PersonMetricsMap {
  [personName: string]: PersonMetrics
}

/**
 * Calculates overall metrics across all running data
 */
export function calculateOverallMetrics(data: ParsedRow[]): OverallMetrics {
  if (data.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      total: 0,
      totalEntries: 0,
    }
  }

  const milesValues = data.map((row) => parseFloat(row["miles run"]))
  const total = milesValues.reduce((sum, val) => sum + val, 0)
  const average = total / data.length
  const min = Math.min(...milesValues)
  const max = Math.max(...milesValues)

  return {
    average: Math.round(average * 100) / 100, // Round to 2 decimal places
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    total: Math.round(total * 100) / 100,
    totalEntries: data.length,
  }
}

/**
 * Calculates metrics for each individual person
 */
export function calculatePerPersonMetrics(
  data: ParsedRow[]
): PersonMetricsMap {
  const personMap: { [key: string]: number[] } = {}

  // Group miles by person
  data.forEach((row) => {
    const person = row.person.trim()
    const miles = parseFloat(row["miles run"])

    if (!personMap[person]) {
      personMap[person] = []
    }
    personMap[person].push(miles)
  })

  // Calculate metrics for each person
  const metrics: PersonMetricsMap = {}

  Object.keys(personMap).forEach((person) => {
    const milesValues = personMap[person]
    const total = milesValues.reduce((sum, val) => sum + val, 0)
    const average = total / milesValues.length
    const min = Math.min(...milesValues)
    const max = Math.max(...milesValues)

    metrics[person] = {
      average: Math.round(average * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      total: Math.round(total * 100) / 100,
      entries: milesValues.length,
    }
  })

  return metrics
}

/**
 * Prepares data for overall miles run over time chart
 * Groups by date and sums miles across all runners
 */
export function prepareOverallTimeSeriesData(data: ParsedRow[]) {
  const dateMap: { [date: string]: number } = {}

  data.forEach((row) => {
    const date = row.date
    const miles = parseFloat(row["miles run"])

    if (!dateMap[date]) {
      dateMap[date] = 0
    }
    dateMap[date] += miles
  })

  // Convert to array and sort by date
  return Object.keys(dateMap)
    .map((date) => ({
      date,
      miles: Math.round(dateMap[date] * 100) / 100,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Prepares data for per-person miles run over time chart
 */
export function preparePersonTimeSeriesData(
  data: ParsedRow[],
  personName: string
) {
  const personData = data
    .filter((row) => row.person.trim() === personName)
    .map((row) => ({
      date: row.date,
      miles: Math.round(parseFloat(row["miles run"]) * 100) / 100,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return personData
}

