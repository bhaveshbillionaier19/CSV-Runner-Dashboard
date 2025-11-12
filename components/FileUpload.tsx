"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { parseCSV, type ParsedRow, type ValidationError } from "@/lib/csvParser"

interface FileUploadProps {
  onDataParsed?: (data: ParsedRow[] | null) => void
  onProcessingComplete?: () => void
  resetKey?: number
}

export default function FileUpload({
  onDataParsed,
  onProcessingComplete,
  resetKey,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedRow[] | null>(null)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (resetKey !== undefined) {
      setSelectedFile(null)
      setParsedData(null)
      setErrors([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [resetKey])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setErrors([])
      setParsedData(null)
      setIsParsing(true)
      
      // Parse and validate the CSV file
      const result = await parseCSV(file)
      
      setIsParsing(false)
      
      if (result.success && result.data) {
        setParsedData(result.data)
        setErrors([])
        onDataParsed?.(result.data)
        onProcessingComplete?.()
      } else {
        setErrors(result.errors)
        const validData = result.data || null
        setParsedData(validData)
        onDataParsed?.(validData)
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>CSV File Upload</CardTitle>
          <CardDescription>
            Upload a CSV file to get started with data analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={handleButtonClick}
                variant="default"
                className="flex items-center gap-2"
                disabled={isParsing}
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-1 min-w-0">
                  <span className="font-medium">Selected:</span>
                  <span className="text-foreground truncate">{selectedFile.name}</span>
                  {isParsing && (
                    <div className="flex items-center gap-2 ml-2">
                      <Spinner size="sm" />
                      <span className="text-xs">Parsing...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-md bg-muted/40 px-4 py-3 text-xs sm:text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Expected CSV columns and formats:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <span className="font-medium text-foreground">date</span> – DD/MM/YYYY (e.g.
                  31/12/2024)
                </li>
                <li>
                  <span className="font-medium text-foreground">person</span> – text (runner&apos;s
                  name)
                </li>
                <li>
                  <span className="font-medium text-foreground">miles run</span> – positive
                  number (decimals allowed)
                </li>
              </ul>
            </div>

            {/* Error Display */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validation Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {parsedData && parsedData.length > 0 && errors.length === 0 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>File Parsed Successfully</AlertTitle>
                <AlertDescription>
                  Successfully parsed {parsedData.length} row{parsedData.length !== 1 ? "s" : ""} from the CSV file.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

