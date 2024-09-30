"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceJson from "../marketplace.json";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import axios from "axios";
import NFTCard from "../components/nftcard/NFTCard";

export default function Marketplace() {
    const [items, setItems] = useState([]);
    const { isConnected, signer } = useContext(WalletContext);

    async function getNFTitems() {
        const itemsArray = [];
        if (!signer) return;
        let contract = new ethers.Contract(
            MarketplaceJson.address,
            MarketplaceJson.abi,
            signer
        );

        let transaction = await contract.getAllListedNFTs();

        for (const i of transaction) {
            const tokenId = parseInt(i.tokenId);
            const tokenURI = await contract.tokenURI(tokenId);
            const meta = (await axios.get(tokenURI)).data;
            const price = ethers.formatEther(i.price);

            const item = {
                price,
                tokenId,
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            };

            itemsArray.push(item);
        }
        return itemsArray;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsArray = await getNFTitems();
                setItems(itemsArray);
            } catch (error) {
                console.error("Error fetching NFT items:", error);
            }
        };

        fetchData();
    }, [isConnected]);

    return (
        <div className="flex flex-col h-screen bg-gradient-to-r from-cyan-500 to-purple-500">
            <Header />
            <div className="flex flex-grow justify-center items-center">
                <div className="max-w-6xl w-full overflow-y-auto p-4">
                    {isConnected ? (
                        <>
                            <div className="mt-8">
                                <h2 className="text-4xl text-white text-center uppercase font-bold mb-7">
                                    NFT Marketplace
                                </h2>
                                {items.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {items.map((value, index) => (
                                            <NFTCard item={value} key={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-300 text-2xl font-semibold mt-6">
                                        No NFT Listed Now...
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-red-500 text-4xl font-bold mt-8">
                            You are not connected...
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
