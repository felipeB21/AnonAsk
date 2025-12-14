import Image from "next/image";
import Link from "next/link";

export default function HomeLink() {
  return (
    <Link href={"/"} className="flex items-center gap-1">
      <Image src={"/icon.png"} alt="AnonAsk" width={32} height={32} />
      <h1 className="text-xl font-bold">AnonAsk</h1>
    </Link>
  );
}
