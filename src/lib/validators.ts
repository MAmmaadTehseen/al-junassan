import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^(\+92|0)?3\d{9}$/, "Enter a valid Pakistani phone number"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Full address is required"),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^(\+92|0)?3\d{9}$/, "Enter a valid Pakistani phone number")
    .optional()
    .or(z.literal("")),
  city: z.string().optional(),
  address: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
