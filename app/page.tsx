"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import FileUpload from "@/components/FileUpload"
import MetricsDisplay from "@/components/MetricsDisplay"
import MilesChart from "@/components/MilesChart"
import PersonSelector from "@/components/PersonSelector"
import { Button } from "@/components/ui/button"
import type { ParsedRow } from "@/lib/csvParser"
import {
  calculateOverallMetrics,
  calculatePerPersonMetrics,
  prepareOverallTimeSeriesData,
  preparePersonTimeSeriesData,
} from "@/lib/metrics"

export default function Home() {
  const [parsedData, setParsedData] = useState<ParsedRow[] | null>(null)
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [shouldScroll, setShouldScroll] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const detailsRef = useRef<HTMLDivElement | null>(null)

  // Calculate metrics
  const overallMetrics = useMemo(() => {
    if (!parsedData) return null
    return calculateOverallMetrics(parsedData)
  }, [parsedData])

  const perPersonMetrics = useMemo(() => {
    if (!parsedData) return {}
    return calculatePerPersonMetrics(parsedData)
  }, [parsedData])

  // Get unique person names
  const personNames = useMemo(() => {
    if (!parsedData) return []
    const uniquePersons = new Set(parsedData.map((row) => row.person.trim()))
    return Array.from(uniquePersons).sort()
  }, [parsedData])

  // Filter data based on selected person
  const filteredData = useMemo(() => {
    if (!parsedData) return null
    if (!selectedPerson) return parsedData
    return parsedData.filter((row) => row.person.trim() === selectedPerson)
  }, [parsedData, selectedPerson])

  // Calculate metrics for filtered data
  const filteredOverallMetrics = useMemo(() => {
    if (!filteredData) return null
    return calculateOverallMetrics(filteredData)
  }, [filteredData])

  // Filter per-person metrics when a person is selected
  const filteredPerPersonMetrics = useMemo(() => {
    if (!selectedPerson) return perPersonMetrics
    const personMetric = perPersonMetrics[selectedPerson]
    return personMetric ? { [selectedPerson]: personMetric } : {}
  }, [perPersonMetrics, selectedPerson])

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!filteredData) return []
    if (selectedPerson) {
      return preparePersonTimeSeriesData(filteredData, selectedPerson)
    }
    return prepareOverallTimeSeriesData(filteredData)
  }, [filteredData, selectedPerson])

  const formatDateForDisplay = (isoDate: string) => {
    if (!isoDate) return ""
    const [year, month, day] = isoDate.split("-")
    if (!year || !month || !day) return isoDate
    return `${day}/${month}/${year}`
  }

  useEffect(() => {
    if (shouldScroll && parsedData && parsedData.length > 0) {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      setShouldScroll(false)
    }
  }, [shouldScroll, parsedData])

  // Reset selected person when new data is loaded
  const handleDataParsed = (data: ParsedRow[] | null) => {
    setParsedData(data)
    setSelectedPerson(null)
  }

  const handleProcessingComplete = () => {
    setShouldScroll(true)
  }

  // Clear all data and reset dashboard
  const handleClearData = () => {
    setParsedData(null)
    setSelectedPerson(null)
    setShouldScroll(false)
    setResetKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">CSV Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Upload and analyze your CSV files
              </p>
            </div>
            {parsedData && parsedData.length > 0 && (
              <Button
                onClick={handleClearData}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Clear Data
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6">
          <FileUpload
            onDataParsed={handleDataParsed}
            onProcessingComplete={handleProcessingComplete}
            resetKey={resetKey}
          />

          {parsedData && parsedData.length > 0 ? (
            <div
              ref={detailsRef}
              className="grid gap-4 sm:gap-6 animate-in fade-in slide-in-from-top-2 duration-500"
            >
              <PersonSelector
                persons={personNames}
                selectedPerson={selectedPerson}
                onPersonChange={setSelectedPerson}
              />

              {overallMetrics && filteredOverallMetrics && (
                <MetricsDisplay
                  overallMetrics={
                    selectedPerson ? filteredOverallMetrics : overallMetrics
                  }
                  perPersonMetrics={filteredPerPersonMetrics}
                />
              )}

              <MilesChart
                data={chartData}
                title={
                  selectedPerson
                    ? `${selectedPerson}'s Miles Run Over Time`
                    : "Overall Miles Run Over Time"
                }
                description={
                  selectedPerson
                    ? `Daily miles run by ${selectedPerson}`
                    : "Total miles run per day across all runners"
                }
                formatDate={formatDateForDisplay}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Upload a CSV file to see metrics and visualizations
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

