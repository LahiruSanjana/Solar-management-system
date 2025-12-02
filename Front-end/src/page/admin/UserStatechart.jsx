"use client";

import { Pie, PieChart } from "recharts";
import { useGetSolarStatusStatsQuery } from "@/lib/redux/Query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export const description = "Solar status chart";

const chartConfig = {
  active: { label: "Active", color: "hsl(142, 96%, 56%)" },
  inactive: { label: "Inactive", color: "hsl(0, 84%, 60%)" },
  maintenance: { label: "Maintenance", color: "hsl(38, 92%, 50%)" },
};

export default function ChartPieLegend() {
  const { data, isLoading, isError } = useGetSolarStatusStatsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading chart.</div>;

  const chartData = [
    { status: "active", value: data.active || 0, fill: chartConfig.active.color },
    { status: "inactive", value: data.inactive || 0, fill: chartConfig.inactive.color },
    { status: "maintenance", value: data.maintenance || 0, fill: chartConfig.maintenance.color },
  ].filter(item => item.value > 0); // Only show categories with data

  return (
    <Card className="flex flex-col  bg-slate-700">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-white">Solar Unit Status</CardTitle>
        <CardDescription className="text-white">Active / Inactive / Maintenance</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={40}
              outerRadius={80}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center text-white"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
