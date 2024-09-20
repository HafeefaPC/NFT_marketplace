"use client"

import { createContext, use } from "react"
export const WalletContext = createContext();
export const WallletContextProvider = ({ children }) => {
    const [isConnected, setConnected] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const [signer, setSigner] = useState();

    return (
        <WalletContext.Provider value={{ isConnected, setConnected, userAddress, setUserAddress, signer, setSigner }}>
            {children}
        </WalletContext.Provider>
    )
}