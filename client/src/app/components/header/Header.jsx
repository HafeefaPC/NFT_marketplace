"use client";
import { WalletContext } from "@/context/wallet";
import { BrowserProvider } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

export default function Header() {
    const {
        isConnected,
        setIsConnected,
        userAddress,
        setUserAddress,
        signer,
        setSigner,
    } = useContext(WalletContext);

    const connectWallet = async () => {
        if (!window.ethereum) {
            throw new Error("Metamask is not installed");
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setSigner(signer);
            const accounts = await provider.send("eth_requestAccounts", []);
            setIsConnected(true);
            setUserAddress(accounts[0]);
            const network = await provider.getNetwork();
            const chainID = network.chainId;
            const sepoliaNetworkId = "11155111";

            if (chainID.toString() !== sepoliaNetworkId) {
                alert("Please switch your MetaMask to sepolia network");
                return;
            }
        } catch (error) {
            console.error("connection error: ", error);
        }
    };

    return (
        <header className="bg-[#003b46] shadow-md py-1 px-8">
            <div className="container mx-auto flex justify-between items-center max-w-6xl">
                <div className="logo">
                    <Link href="/">
                        <Image src="/logo.png" width={280} height={44} alt="logo" />
                    </Link>
                </div>
                <nav className="flex items-center gap-5">
                    <ul className="flex list-none m-0 p-0">
                        <li className="mr-5 last:mr-0">
                            <Link href="/marketplace" className="text-[#00cffd] font-bold text-xl transition-all duration-300 hover:text-[#0091bf]">
                                MarketPlace
                            </Link>
                        </li>
                        <li className="mr-5 last:mr-0">
                            <Link href="/sellNFT" className="text-[#00cffd] font-bold text-xl transition-all duration-300 hover:text-[#0091bf]">
                                List
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile" className="text-[#00cffd] font-bold text-xl transition-all duration-300 hover:text-[#0091bf]">
                                Profile
                            </Link>
                        </li>
                    </ul>
                    <button
                        className={`${isConnected ? "bg-green-600 cursor-not-allowed opacity-80" : "bg-[#ff6f61] hover:bg-[#e65c50] cursor-pointer"
                            } text-white font-semibold text-lg py-2 px-4 rounded transition-all duration-300`}
                        onClick={connectWallet}
                    >
                        {isConnected ? `${userAddress?.slice(0, 8)}...` : "Connect wallet"}
                    </button>
                </nav>
            </div>
        </header>
    );
}
