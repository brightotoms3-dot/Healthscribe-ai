"use client"

import {
  Bar,
  BarChart,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SymptomLikelihoodChartProps {
  data: {
    cause: string;
    likelihood: number;
    explanation: string;
  }[];
}

export function SymptomLikelihoodChart({ data }: SymptomLikelihoodChartProps) {
  const chartData = data.map(item => ({ ...item, fill: 'hsl(var(--primary))' }));
  const chartConfig = {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Possibility</CardTitle>
        <CardDescription>
          This chart displays the relative likelihood of possible causes for your symptoms. It is not a diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-48 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 40 }}
          >
            <XAxis type="number" dataKey="likelihood" hide />
            <YAxis
              dataKey="cause"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="capitalize"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value, name, props) => (
                  <div className="space-y-1">
                    <p className="font-bold">{props.payload.cause} ({value}%)</p>
                    <p className="text-xs text-muted-foreground">{props.payload.explanation}</p>
                  </div>
                )}
              />}
            />
            <Bar dataKey="likelihood" radius={5}>
               <LabelList
                position="right"
                offset={10}
                className="font-semibold"
                fontSize={12}
                formatter={(value: number) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
