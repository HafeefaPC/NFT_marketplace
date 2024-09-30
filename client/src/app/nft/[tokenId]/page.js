"use client";
import { WalletContext } from "@/context/wallet";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import MarketplaceJson from "../../marketplace.json";
import { ethers } from "ethers";
import axios from "axios";
import GetIpfsUrlFromPinata from "@/app/utils";
import Image from "next/image";
import Header from "@/app/components/header/Header";
import Footer from "@/app/components/footer/Footer";

export default function NFTPage() {
    const params = useParams();
    const tokenId = params.tokenId;
    const [item, setItem] = useState();
    const [msg, setmsg] = useState();
    const [btnContent, setBtnContent] = useState("Buy NFT");
    const { isConnected, userAddress, signer } = useContext(WalletContext);
    const router = useRouter();

    async function getNFTData() {
        if (!signer) return;
        let contract = new ethers.Contract(
            MarketplaceJson.address,
            MarketplaceJson.abi,
            signer
        );
        let tokenURI = await contract.tokenURI(tokenId);
        console.log(tokenURI);
        const listedToken = await contract.getNFTListing(tokenId);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        console.log(tokenURI);
        const meta = (await axios.get(tokenURI)).data;
        const item = {
            price: meta.price,
            tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        };
        return item;
    }

    useEffect(() => {
        async function fetchData() {
            if (!signer) return;
            try {
                const itemTemp = await getNFTData();
                setItem(itemTemp);
            } catch (error) {
                console.error("Error fetching NFT items:", error);
                setItem(null);
            }
        }

        fetchData();
    }, [isConnected]);

    async function buyNFT() {
        try {
            if (!signer) return;
            let contract = new ethers.Contract(
                MarketplaceJson.address,
                MarketplaceJson.abi,
                signer
            );
            const salePrice = ethers.parseUnits(item.price, "ether").toString();
            setBtnContent("Processing...");
            setmsg("Buying the NFT... Please Wait (Upto 5 mins)");
            let transaction = await contract.executeSale(tokenId, {
                value: salePrice,
            });
            await transaction.wait();
            alert("You successfully bought the NFT!");
            setmsg("");
            setBtnContent("Buy NFT");
            router.push("/");
        } catch (e) {
            console.log("Buying Error: ", e);
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-r from-[#00cffd] to-[#b57edc]">
            <Header />
            <div className="flex flex-col justify-center items-center flex-grow">
                {isConnected ? (
                    <div className="bg-gray-200 max-w-6xl mx-auto mb-24 shadow-lg rounded-lg overflow-hidden pr-2.5">
                        <div className="grid grid-cols-2 gap-4">
                            <Image src={item?.image} alt="" width={800} height={520} />
                            <div className="flex flex-col items-center justify-between p-4">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="text-orange-500 w-full">
                                        <span className="text-xl font-bold mr-2.5">Name:</span>
                                        <span className="text-lg break-words">{item?.name}</span>
                                    </div>
                                    <div className="text-orange-500 w-full">
                                        <span className="text-xl font-bold mr-2.5">
                                            Description:
                                        </span>
                                        <span className="text-lg break-words">
                                            {item?.description}
                                        </span>
                                    </div>
                                    <div className="text-orange-500 w-full">
                                        <span className="text-xl font-bold mr-2.5">Price:</span>
                                        <span className="text-lg break-words">{item?.price} ETH</span>
                                    </div>
                                    <div className="text-orange-500 w-full">
                                        <span className="text-xl font-bold mr-2.5">Seller:</span>
                                        <span className="text-lg break-words">{item?.seller}</span>
                                    </div>
                                </div>
                                <div className="mt-4 w-full">
                                    <div className="text-red-500 font-medium text-lg text-center">
                                        {msg}
                                    </div>
                                    {userAddress.toLowerCase() === item?.seller.toLowerCase() ? (
                                        <div className="text-green-600 font-medium text-2xl text-center">
                                            You already Own!
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                buyNFT();
                                            }}
                                            className="flex items-center justify-center border-none rounded-lg cursor-pointer text-xl font-bold w-full py-5 bg-red-400 text-white transition duration-300 hover:bg-red-500 mt-4"
                                        >
                                            {btnContent === "Processing..." && (
                                                <span className="inline-block border-4 border-gray-400 border-t-white rounded-full mr-2 w-6 h-6 animate-spin"></span>
                                            )}
                                            {btnContent}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-4xl font-bold text-red-500 text-center mb-24">
                        You are not connected...
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
