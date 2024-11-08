import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PhoneNumberUtil } from "google-libphonenumber";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIfIsValidPhoneNumber = (phoneNumber: string) => {
  const phoneUtil = PhoneNumberUtil.getInstance();

  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phoneNumber));
  } catch (error) {
    return false;
  }
};

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
