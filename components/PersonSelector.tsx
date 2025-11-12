"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface PersonSelectorProps {
  persons: string[]
  selectedPerson: string | null
  onPersonChange: (person: string | null) => void
}

export default function PersonSelector({
  persons,
  selectedPerson,
  onPersonChange,
}: PersonSelectorProps) {
  if (persons.length === 0) {
    return null
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <Label htmlFor="person-select" className="text-sm font-medium">Filter by Runner</Label>
      <Select
        value={selectedPerson || "all"}
        onValueChange={(value) => {
          onPersonChange(value === "all" ? null : value)
        }}
      >
        <SelectTrigger id="person-select" className="w-full sm:w-[300px]">
          <SelectValue placeholder="Select a runner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Runners</SelectItem>
          {persons.map((person) => (
            <SelectItem key={person} value={person}>
              {person}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

