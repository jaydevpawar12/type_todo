import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile must be a valid 10-digit number."),
  hero: z.string().optional(), // Optional for file uploads
});

export const loginSchema = z.object({
    email: z
      .string()
      .email("Invalid email address.")
      .optional(), // Allow either email or mobile
    mobile: z
      .string()
      .regex(/^\d{10}$/, "Mobile must be a valid 10-digit number.")
      .optional(),
    password: z.string().min(8, "Password is required."),
  }).refine(
    (data) => data.email || data.mobile,
    {
      message: "Either email or mobile is required.",
      path: ["email"], // Focus error on email if both are missing
    }
  );
  
export   const todoSchema = z.object({
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(100, { message: "Title must be less than 100 characters" }),
    desc: z
      .string()
      .min(1, { message: "Description is required" })
      .max(500, { message: "Description must be less than 500 characters" }),
    message: z
      .string()
      .min(1, { message: "Message is required" })
      .max(200, { message: "Message must be less than 200 characters" }),
    skills: z.array(z.string()),
      // .min(1, { message: "At least one skill is required" }),
    type: z
      .enum(["frontend", "backend"], {
        required_error: "Type is required",
        invalid_type_error: "Type must be either 'frontend' or 'backend'",
      }),
    priority: z
      .enum(["low", "medium", "high"], {
        required_error: "Priority is required",
        invalid_type_error: "Priority must be one of 'low', 'medium', or 'high'",
      }),
  });

