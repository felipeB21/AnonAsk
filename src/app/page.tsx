import NewAsk from "@/components/new-ask";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-10">
      <Link href={"/"}>
        <h1 className="text-xl font-bold">AnonAsk</h1>
      </Link>
      <NewAsk />
    </main>
  );
}
