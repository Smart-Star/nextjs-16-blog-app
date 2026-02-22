import { loginSchema, signUpSchema } from "@/app/schemas/auth";
import z from "zod";

export interface SignupFormControlsType {
  name: keyof z.infer<typeof signUpSchema>;
  label: string;
  type: string;
  placeholder: string;
}

export interface LoginFormControlsType {
  name: keyof z.infer<typeof loginSchema>;
  label: string;
  type: string;
  placeholder: string;
}
