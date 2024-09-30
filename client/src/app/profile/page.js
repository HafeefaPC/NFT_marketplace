"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceJson from "../marketplace.json";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import axios from "axios";
import NFTTile from "../components/nftcard/NFTCard";

export default function Profile() {
    const [items, setItems] = useState();
    const [totalPrice, setTotalPrice] = useState("0");
    const { isConnected, userAddress, signer } = useContext(WalletContext);

    async function getNFTitems() {
        let sumPrice = 0;
        const itemsArray = [];
        if (!signer) return;
        let contract = new ethers.Contract(
            MarketplaceJson.address,
            MarketplaceJson.abi,
            signer
        );

        let transaction = await contract.getMyNFTs();

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
            sumPrice += Number(price);
        }
        return { itemsArray, sumPrice };
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { itemsArray, sumPrice } = await getNFTitems();
                setItems(itemsArray);
                setTotalPrice(sumPrice);
            } catch (error) {
                console.error("Error fetching NFT items:", error);
            }
        };

        fetchData();
    }, [isConnected]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-cyan-400 to-purple-400">
            <Header />
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="max-w-7xl mx-auto mb-20 max-h-[700px] overflow-y-auto p-2">
                    {isConnected ? (
                        <>
                            <div className="my-5 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold mb-2 text-gray-200">
                                    Wallet Address:
                                </span>
                                <span className="text-xl font-bold">{userAddress}</span>
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <span className="text-2xl font-bold mr-2 text-gray-200">
                                        Number of NFTs:
                                    </span>
                                    <span className="text-2xl font-bold">{items?.length}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-2xl font-bold mr-2 text-gray-200">
                                        Total Value:
                                    </span>
                                    <span className="text-2xl font-bold">{totalPrice} ETH</span>
                                </div>
                            </div>
                            <div className="mt-5">
                                <h2 className="text-4xl text-center text-white my-4">
                                    Your NFTs
                                </h2>
                                {items?.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-5">
                                        {items?.map((value, index) => (
                                            <NFTTile item={value} key={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-2xl font-bold text-red-500 text-center mt-4">
                                        You don't have any NFT...
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-4xl font-bold text-red-500 text-center mt-4">
                            You are not connected...
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
