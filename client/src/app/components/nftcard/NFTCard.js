import GetIpfsUrlFromPinata from "@/app/utils";
import Image from "next/image";
import Link from "next/link";

export default function NFTCard({ item }) {
    const IPFSUrl = GetIpfsUrlFromPinata(item.image);

    const limitedDescription =
        item.description.length > 100
            ? item.description.substring(0, 100) + "..."
            : item.description;

    return (
        <div className="relative overflow-hidden rounded-lg shadow-lg">
            <div className="relative w-full h-full transform transition-transform duration-300 hover:scale-105">
                <Image src={IPFSUrl} alt={item.name} width={500} height={360} />
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-orange-500 to-yellow-300 p-5 opacity-0 transform translate-y-full transition-all duration-300 hover:opacity-100 hover:translate-y-0">
                <Link href={`/nft/${item.tokenId}`}>
                    <a className="text-white">
                        <strong className="text-lg font-bold block mb-2">{item.name}</strong>
                        <p className="text-sm truncate">{limitedDescription}</p>
                    </a>
                </Link>
            </div>
        </div>
    );
}
