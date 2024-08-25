import { ReactNode, useState, createContext, useContext } from "react";

//Creating a global state for the entire app, to make storing and managing data easier and more efficient. 

//Types
interface tcContextType {
    transC: string | null;
    setTransC: (tc: string | null) => void;
}

//Initializing context with undefined as the default value
const tcContext = createContext<tcContextType | undefined>(undefined);

//Creating the provider component
export const TcContextExp = ({ children }: { children: ReactNode }) => {
    const [transC, setTransC] = useState<string | null>(null);

    return (
        <tcContext.Provider value={{ transC, setTransC }}>
            {children}
        </tcContext.Provider>
    );
}

//Custom hook to use the context
export const useTransC = () => {
    const context = useContext(tcContext);
    if (!context)
        throw new Error("useTransC must be used within a tcContextExp provider!");
    return context;
}
