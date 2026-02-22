import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { LoginFormControlsType, SignupFormControlsType } from "./type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const signUpFormControls: SignupFormControlsType[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "John Doe",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "john@doe.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "********",
  },
];

export const loginFormControls: LoginFormControlsType[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "john@doe.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "********",
  },
];
