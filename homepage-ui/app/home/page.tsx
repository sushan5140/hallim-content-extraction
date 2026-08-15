import type { Metadata } from "next";
import HallimHomepage, { type HallimHomeData } from "@/components/home/hallim-homepage";
// import { createClient } from "@/lib/supabase/auth-server"; // wire to your real auth/db

export const metadata: Metadata = {
  title: "Hallim — Home",
  description: "Your TOPIK prep at a glance: roadmap, practice, and progress.",
};

export default async function HomePage() {
  // Replace with real session + roadmap/progress lookups, e.g.:
  // const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // const data = await getHallimHomeData(user.id);

  const data: HallimHomeData | undefined = undefined; // omit to use built-in mock data

  return <HallimHomepage data={data} />;
}
