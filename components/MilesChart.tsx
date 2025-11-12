"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartDataPoint {
  date: string
  miles: number
}

interface MilesChartProps {
  data: ChartDataPoint[]
  title: string
  description?: string
  formatDate?: (date: string) => string
}

export default function MilesChart({
  data,
  title,
  description,
  formatDate,
}: MilesChartProps) {
  const formatDateValue = (value: string) =>
    formatDate ? formatDate(value) : value

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data available to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-0">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval="preserveStartEnd"
                tickFormatter={formatDateValue}
              />
              <YAxis
                label={{ value: "Miles", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
                tick={{ fontSize: 11 }}
              />
            <Tooltip
              formatter={(value: number) => [`${value} mi`, "Miles"]}
              labelFormatter={(label) => `Date: ${formatDateValue(label)}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="miles"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Miles Run"
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

