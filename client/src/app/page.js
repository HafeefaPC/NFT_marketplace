
import Image from "next/image";
import Header from "../app/components/header/header";
import Footer from "../app/components/footer/footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-cyan-400 to-purple-300">
      <Header />
      <div className="flex items-center justify-between max-w-screen-xl mx-auto mb-24 w-full flex-grow px-5 gap-5">
        <div>
          <h1 className="text-4xl leading-tight mb-8">
            Where Art Meets Innovation, Step into NFTstore!
          </h1>
          <p className="text-xl leading-normal mb-12 mr-5">
            Enter the nexus of creativity and innovation at NFTstore. Uncover a
            realm of digital marvels, and together, let's redefine the future of
            collectibles.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/marketplace">
              <button className="bg-red-500 text-white text-lg font-semibold py-4 px-8 rounded-lg transition-all hover:bg-red-400">
                Buy Now!
              </button>
            </Link>
            <Link href="/sellNFT">
              <button className="bg-white text-black text-lg font-semibold py-4 px-8 rounded-lg transition-all hover:bg-gray-300">
                List Now!
              </button>
            </Link>
          </div>
        </div>
        <Image src="/pic1.png" alt="NFTs" width={400} height={550} />
      </div>
      <Footer />
    </div>
  );
}
