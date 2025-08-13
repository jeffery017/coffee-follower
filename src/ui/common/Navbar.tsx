import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-2 px-4 gap-2 bg-background">
        <Link href="/" className="flex items-center gap-2">
        {/* <Image
            src="/logo.png"
            alt="Coffee Follower"
            width={100}
            height={100} 
            className="w-10 h-10"
        /> */}
        <p className="text-xl font-bold">Coffee Follower</p>
      </Link>
      <div className="grow"></div>
    </nav>
  )
}