"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useGetEnergyGenerationRecordsQuery, useGetLast24HoursEnergyDataQuery,useGetSolarUnitsByClerkIdQuery } from "@/lib/redux/Query"
import { toDate, format } from "date-fns"
import { formatInTimeZone } from 'date-fns-tz'
import { useState } from "react"
import { useUser } from "@clerk/clerk-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A simple area chart"

const chartConfig = {
  desktop: {
    label: "Energy",
    color: "var(--chart-1)",
  },
}

export default function ChartAreaDefault({ solarUnitId }) {
  const { user } = useUser();
  const timeZone = "Europe/London";
  const [selectedDay, setSelectedDay] = useState(7)

  const handleDayChange = (value) => {
    setSelectedDay(Number(value))
  }
  const energyQuery7or30 = useGetEnergyGenerationRecordsQuery(
    { id: solarUnitId, groupBy: "date", limit: selectedDay },
    { skip: selectedDay === 24 }
  )

  const energyQuery24 = useGetLast24HoursEnergyDataQuery(
    { id: solarUnitId },
  )

  const energyRecords = selectedDay === 24 ? energyQuery24.data || [] : energyQuery7or30.data || []
  const isLoading = selectedDay === 24 ? energyQuery24.isLoading : energyQuery7or30.isLoading
  const isError = selectedDay === 24 ? energyQuery24.isError : energyQuery7or30.isError
  const error = selectedDay === 24 ? energyQuery24.error : energyQuery7or30.error

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.toString()}</div>
  if(!energyRecords || energyRecords.length===0) return  (
      <div className="p-6 bg-gray-50 rounded-xl shadow animate-pulse mx-4 mt-4">
        <div className="text-red-500 text-2xl mb-4">No solar units available</div>
        <div className="h-4 w-48 bg-gray-300 rounded mb-3"></div>
        <div className="h-3 w-64 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-56 bg-gray-200 rounded"></div>
      </div>
    );

  const energyGenerationRecords = energyRecords.map((e) => {
    const dateValue = e._id?.date ? toDate(e._id.date) : new Date(e.timestamp)
    const energyValue = e.totalEnergy || e.generatedEnergy / 1000
    return {
      date: formatInTimeZone(dateValue,timeZone, selectedDay === 24 ? "HH:mm" : "MMM d"),
      day: format(dateValue, "EEE"),
      energy: parseFloat(energyValue.toFixed(2)),
    }
  })

  return (
    <Card className="p-5 mt-8 mr-4">
      <CardHeader className="flex flex-col items-center justify-between space-y-2 pb-2">
        <CardTitle>Energy Generation</CardTitle>
        <CardDescription>
          Showing total energy generation for the last{" "}
          {selectedDay === 24 ? "24 hours" : `${selectedDay} days`}
        </CardDescription>
        <div className="ml-auto flex items-center space-x-2">
          <Select value={selectedDay} onValueChange={handleDayChange}>
            <SelectTrigger >
              <SelectValue>
                {selectedDay === 24 ? "Last 24 Hours" : `Last ${selectedDay} Days`}
              </SelectValue>
              <SelectValue placeholder="Select a day range"  width="100%"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="24">Last 24 Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="p-4 h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={energyGenerationRecords}
              margin={{ left: 8, right: 8 }}
            >
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="20%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <defs>
              <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#84CC16" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#84CC16" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                dataKey="energy"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="energy"
                type="natural"
                stroke="#84CC16"
                fill="url(#limeGradient)"
                fillOpacity={1}
                strokeWidth={2}
                dot={{ fill: "#84CC16" }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Total Output: {energyGenerationRecords.reduce((acc, curr) => acc + curr.energy, 0).toFixed(2)} kWh
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {energyGenerationRecords[0]?.date} - {energyGenerationRecords[energyGenerationRecords.length - 1]?.date}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
