
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-[#003b46] text-white z-1000  shadow-md">
            <div className="flex flex-col items-center justify-between max-w-6xl mx-auto">
                <p className="text-sm m-0">Copyright &copy; {year} NFTStore. All rights reserved!</p>
                <ul className="flex list-none p-0 mt-2">
                    <li className="mr-3">
                        <Link href="#">
                            <Image src="/x.png" width={40} height={40} alt="x logo" className="rounded-full" />
                        </Link>
                    </li>
                    <li className="mr-3">
                        <Link href="https://telegram.org/">
                            <Image
                                src="/telegram.png"
                                width={40}
                                height={40}
                                alt="telegram logo"
                                className="rounded-full"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link href="#">
                            <Image
                                src="/youtube.png"
                                width={40}
                                height={40}
                                alt="youtube logo"
                                className="rounded-full"
                            />
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
