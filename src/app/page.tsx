import HomeLink from "@/components/home-link";
import NewAsk from "@/components/new-ask";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-10">
      <HomeLink />
      <NewAsk />
    </main>
  );
}
