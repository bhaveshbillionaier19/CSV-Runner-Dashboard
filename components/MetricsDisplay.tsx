"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { OverallMetrics, PersonMetricsMap } from "@/lib/metrics"

interface MetricsDisplayProps {
  overallMetrics: OverallMetrics
  perPersonMetrics: PersonMetricsMap
}

export default function MetricsDisplay({
  overallMetrics,
  perPersonMetrics,
}: MetricsDisplayProps) {
  const personNames = Object.keys(perPersonMetrics).sort()

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      {/* Overall Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Metrics</CardTitle>
          <CardDescription>Statistics across all runners</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-muted-foreground">Average Miles:</span>
              <span className="text-lg font-semibold text-foreground">{overallMetrics.average} mi</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-muted-foreground">Minimum Miles:</span>
              <span className="text-lg font-semibold text-foreground">{overallMetrics.min} mi</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-muted-foreground">Maximum Miles:</span>
              <span className="text-lg font-semibold text-foreground">{overallMetrics.max} mi</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-muted-foreground">Total Miles:</span>
              <span className="text-lg font-semibold text-foreground">{overallMetrics.total} mi</span>
            </div>
            <div className="flex justify-between items-center pt-3 mt-3 border-t">
              <span className="text-sm font-medium text-muted-foreground">Total Entries:</span>
              <span className="text-sm font-semibold text-foreground">{overallMetrics.totalEntries}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per-Person Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Per-Person Metrics</CardTitle>
          <CardDescription>Statistics for each runner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personNames.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data available</p>
            ) : (
              personNames.map((person) => {
                const metrics = perPersonMetrics[person]
                return (
                  <div
                    key={person}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <h4 className="font-semibold mb-3 text-base">{person}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Avg: </span>
                        <span className="font-medium">{metrics.average} mi</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Min: </span>
                        <span className="font-medium">{metrics.min} mi</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max: </span>
                        <span className="font-medium">{metrics.max} mi</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total: </span>
                        <span className="font-medium">{metrics.total} mi</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t text-xs text-muted-foreground">
                        {metrics.entries} entr{metrics.entries !== 1 ? "ies" : "y"}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

