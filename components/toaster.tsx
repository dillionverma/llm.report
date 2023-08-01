"use client";

import { Toaster as T } from "react-hot-toast";

export function Toaster() {
  return (
    <T
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          maxWidth: 500,
        },
      }}
    />
  );
}
