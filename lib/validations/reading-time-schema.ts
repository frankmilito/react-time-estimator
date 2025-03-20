import { z } from "zod"

export const readingTimeSchema = z.object({
  pageCount: z
    .number({
      required_error: "Page count is required",
      invalid_type_error: "Page count must be a number",
    })
    .positive("Page count must be greater than 0")
    .int("Page count must be a whole number"),
  readingSpeed: z
    .number({
      required_error: "Reading speed is required",
      invalid_type_error: "Reading speed must be a number",
    })
    .positive("Reading speed must be greater than 0")
    .int("Reading speed must be a whole number")
    .max(100, "Reading speed cannot exceed 100 pages per hour"),
})

export type ReadingTimeFormValues = z.infer<typeof readingTimeSchema>

