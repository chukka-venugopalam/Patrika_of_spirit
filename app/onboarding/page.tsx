import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Welcome to AwareNet",
  description: "Tell us what you care about",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
