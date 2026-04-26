import type { Metadata } from "next";
import AuthRouteLayoutClient from "./AuthRouteLayoutClient";

export const metadata: Metadata = {
  title: "Authentication - NoteHub",
  description: "Sign in or sign up to manage your notes.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRouteLayoutClient>{children}</AuthRouteLayoutClient>;
}
