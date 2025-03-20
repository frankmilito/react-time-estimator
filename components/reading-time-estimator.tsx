"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Book, Clock, Settings, AlertCircle } from "lucide-react"
import { calculateReadingTime } from "@/lib/calculate-reading-time"
import { readingTimeSchema, type ReadingTimeFormValues } from "@/lib/validations/reading-time-schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ReadingTimeEstimator() {
  const [readingTimeMinutes, setReadingTimeMinutes] = useState<number | null>(null)
  const [isCalculated, setIsCalculated] = useState<boolean>(false)

  const form = useForm<ReadingTimeFormValues>({
    resolver: zodResolver(readingTimeSchema),
    defaultValues: {
      pageCount: undefined,
      readingSpeed: 30,
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form

  const currentReadingSpeed = watch("readingSpeed")

  const onSubmit = (data: ReadingTimeFormValues) => {
    const minutes = calculateReadingTime(data.pageCount, data.readingSpeed)
    setReadingTimeMinutes(minutes)
    setIsCalculated(true)
  }

  const handleReset = () => {
    reset()
    setReadingTimeMinutes(null)
    setIsCalculated(false)
  }

  const handleSliderChange = (value: number[]) => {
    setValue("readingSpeed", value[0], { shouldValidate: true })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          <span>Reading Time Estimator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="pageCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Book className="h-4 w-4" />
                    Page Count
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Enter number of pages"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? undefined : Number.parseInt(value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="readingSpeed"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Reading Speed: {field.value} pages per hour
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => handleSliderChange(value)}
                      className="w-full"
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground">
                    {field.value < 20 ? "Slow" : field.value < 40 ? "Average" : field.value < 60 ? "Fast" : "Very Fast"}{" "}
                    reading pace
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" className="w-full">
                Calculate
              </Button>
              <Button type="button" onClick={handleReset} variant="outline" className="w-full">
                Reset
              </Button>
            </div>
          </form>
        </Form>

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please fix the errors above before calculating reading time.</AlertDescription>
          </Alert>
        )}

        {isCalculated && readingTimeMinutes !== null && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5" />
              Estimated Reading Time:
            </h3>
            <p className="text-2xl font-bold">
              {readingTimeMinutes} minute{readingTimeMinutes !== 1 ? "s" : ""}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {form.getValues().pageCount} pages at {form.getValues().readingSpeed} pages per hour
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

