"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import marketplace from "./../marketplace.json";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";

export default function SellNFT() {
    const [formParams, updateFormParams] = useState({
        name: "",
        description: "",
        price: "",
    });
    const [fileURL, setFileURL] = useState();
    const [message, updateMessage] = useState("");
    const [btn, setBtn] = useState(false);
    const [btnContent, setBtnContent] = useState("List NFT");
    const router = useRouter();
    const { isConnected, signer } = useContext(WalletContext);

    async function onFileChange(e) {
        try {
            const file = e.target.files[0];
            const data = new FormData();
            data.set("file", file);
            setBtn(false);
            updateMessage("Uploading image... Please don't click anything!");
            const response = await uploadFileToIPFS(data);
            if (response.success === true) {
                setBtn(true);
                updateMessage("");
                setFileURL(response.pinataURL);
            }
        } catch (e) {
            console.log("Error during file upload...", e);
        }
    }

    async function uploadMetadataToIPFS() {
        const { name, description, price } = formParams;
        if (!name || !description || !price || !fileURL) {
            updateMessage("Please fill all the fields!");
            return -1;
        }

        const nftJSON = {
            name,
            description,
            price,
            image: fileURL,
        };

        try {
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success === true) {
                return response.pinataURL;
            }
        } catch (e) {
            console.log("Error uploading JSON metadata: ", e);
        }
    }

    async function listNFT(e) {
        try {
            setBtnContent("Processing...");
            const metadataURL = await uploadMetadataToIPFS();
            if (metadataURL === -1) return;

            updateMessage("Uploading NFT...Please dont click anything!");

            let contract = new ethers.Contract(
                marketplace.address,
                marketplace.abi,
                signer
            );
            const price = ethers.parseEther(formParams.price);

            let transaction = await contract.createToken(metadataURL, price);
            await transaction.wait();

            setBtnContent("List NFT");
            setBtn(false);
            updateMessage("");
            updateFormParams({ name: "", description: "", price: "" });
            alert("Successfully listed your NFT!");
            router.push("/");
        } catch (e) {
            alert("Upload error", e);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-cyan-500 to-purple-500">
            <Header />
            {isConnected ? (
                <div className="flex flex-grow justify-center items-center">
                    <div className="bg-gray-200 w-full max-w-md p-6 h-fit mb-20 shadow-lg rounded-lg">
                        <h2 className="text-orange-600 text-2xl font-extrabold text-center uppercase mb-2">
                            Upload your NFT
                        </h2>
                        <div>
                            <div className="mb-2">
                                <label className="block text-orange-600 font-bold mb-2">NFT name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border text-black border-black rounded-lg bg-transparent"
                                    value={formParams.name}
                                    onChange={(e) =>
                                        updateFormParams({ ...formParams, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-orange-600 font-bold mb-2">NFT description</label>
                                <textarea
                                    className="w-full p-3 text-black border border-black rounded-lg bg-transparent h-28"
                                    value={formParams.description}
                                    onChange={(e) =>
                                        updateFormParams({
                                            ...formParams,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-orange-600 font-bold mb-2">Price (in Eth)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 text-black border border-black rounded-lg bg-transparent"
                                    value={formParams.price}
                                    onChange={(e) =>
                                        updateFormParams({ ...formParams, price: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-orange-600 font-bold mb-2">Upload image</label>
                                <input
                                    type="file"
                                    className="w-full p-3 border border-black rounded-lg bg-transparent"
                                    onChange={onFileChange}
                                />
                            </div>
                            <div className="text-center text-red-600 font-medium ">
                                {message}
                            </div>
                            <button
                                onClick={listNFT}
                                disabled={!btn}
                                className={`w-full p-1 text-lg font-bold rounded-lg flex justify-center items-center mt-4 ${btn
                                    ? "bg-orange-600 text-white hover:bg-orange-700"
                                    : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                                    }`}
                            >
                                {btnContent === "Processing..." && (
                                    <span className="inline-block w-6 h-6 border-4 border-gray-600 border-l-white rounded-full animate-spin mr-2"></span>
                                )}
                                {btnContent}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-grow justify-center items-center">
                    <div className="text-2xl font-bold text-red-600">
                        Connect Your Wallet to Continue...
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
