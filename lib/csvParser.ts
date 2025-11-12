import Papa from "papaparse"

export interface ParsedRow {
  date: string
  person: string
  "miles run": string
  [key: string]: string
}

export interface ValidationError {
  type: "header" | "date" | "miles" | "row"
  message: string
  rowIndex?: number
  column?: string
}

export interface ParseResult {
  success: boolean
  data?: ParsedRow[]
  errors: ValidationError[]
}

const REQUIRED_HEADERS = ["date", "person", "miles run"]

/**
 * Attempts to parse a date in DD/MM/YYYY format and returns ISO string (YYYY-MM-DD)
 */
function normalizeDate(dateString: string): string | null {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
  if (!dateRegex.test(dateString)) {
    return null
  }

  const [dayStr, monthStr, yearStr] = dateString.split("/")
  const day = Number(dayStr)
  const month = Number(monthStr)
  const year = Number(yearStr)

  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  const isoMonth = month.toString().padStart(2, "0")
  const isoDay = day.toString().padStart(2, "0")

  return `${yearStr}-${isoMonth}-${isoDay}`
}

/**
 * Validates if a string is a valid positive number
 */
function isValidMiles(milesString: string): boolean {
  const trimmed = milesString.trim()
  if (trimmed === "") {
    return false
  }
  
  const number = parseFloat(trimmed)
  return !isNaN(number) && number > 0 && isFinite(number)
}

/**
 * Validates CSV headers
 */
function validateHeaders(headers: string[]): ValidationError | null {
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim())
  
  for (const requiredHeader of REQUIRED_HEADERS) {
    if (!normalizedHeaders.includes(requiredHeader)) {
      return {
        type: "header",
        message: `Missing required header: "${requiredHeader}"`,
      }
    }
  }
  
  return null
}

/**
 * Parses and validates a CSV file
 */
export async function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const errors: ValidationError[] = []
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[]
        
        // Check if we have any data
        if (data.length === 0) {
          errors.push({
            type: "header",
            message: "CSV file is empty or contains no data rows",
          })
          resolve({ success: false, errors })
          return
        }
        
        // Get headers from the first row keys
        const headers = Object.keys(data[0] || {})
        
        // Validate headers
        const headerError = validateHeaders(headers)
        if (headerError) {
          errors.push(headerError)
          resolve({ success: false, errors })
          return
        }
        
        // Normalize headers (case-insensitive matching)
        const headerMap: { [key: string]: string } = {}
        headers.forEach((header) => {
          const normalized = header.toLowerCase().trim()
          if (REQUIRED_HEADERS.includes(normalized)) {
            headerMap[normalized] = header
          }
        })
        
        // Validate each row
        const validatedData: ParsedRow[] = []
        
        data.forEach((row, index) => {
          const rowErrors: ValidationError[] = []
          
          // Get values using normalized header names
          const dateInputValue = row[headerMap["date"]]?.toString().trim() || ""
          const personValue = row[headerMap["person"]]?.toString().trim() || ""
          const milesValue = row[headerMap["miles run"]]?.toString().trim() || ""

          const normalizedDate = normalizeDate(dateInputValue)
          
          // Validate date
          if (!normalizedDate) {
            rowErrors.push({
              type: "date",
              message: `Invalid date format in row ${index + 2}: "${dateInputValue}". Expected DD/MM/YYYY format.`,
              rowIndex: index + 2,
              column: "date",
            })
          }
          
          // Validate miles run
          if (!isValidMiles(milesValue)) {
            rowErrors.push({
              type: "miles",
              message: `Invalid miles value in row ${index + 2}: "${milesValue}". Must be a positive number.`,
              rowIndex: index + 2,
              column: "miles run",
            })
          }
          
          // If row has errors, add them to the errors array
          if (rowErrors.length > 0) {
            errors.push(...rowErrors)
          } else {
            // Only add valid rows to the validated data
            validatedData.push({
              date: normalizedDate!,
              person: personValue,
              "miles run": milesValue,
            })
          }
        })
        
        // If there are validation errors, return them
        if (errors.length > 0) {
          resolve({
            success: false,
            data: validatedData.length > 0 ? validatedData : undefined,
            errors,
          })
          return
        }
        
        // Success
        resolve({
          success: true,
          data: validatedData,
          errors: [],
        })
      },
      error: (error) => {
        errors.push({
          type: "header",
          message: `Failed to parse CSV file: ${error.message}`,
        })
        resolve({ success: false, errors })
      },
    })
  })
}

