import {createContext, type ReactNode, useContext, useState} from "react";

interface Toast {
    id:number;
    message:string;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message:string) => void;
    removeToast: (id:number) => void;
}

const ToastDisplayTime = 3000;
const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider = ({children} : {children:ReactNode}) => {

    const [toasts,setTosts] = useState<Toast[]>([]);

    const addToast = (message:string) => {
        const id = ++toastId;
        setTosts(prev => [...prev, {id,message}]);
        setTimeout(() => removeToast(id),ToastDisplayTime)
    }

    const removeToast = (id:number) => {
        setTosts(prev => prev.filter(t => t.id !== id))
    }


    return (
        <ToastContext.Provider value={{toasts, addToast, removeToast}}>
            {children}
            <div style={{position: "fixed", top:100,left:0,right:0, zIndex:999,display: "flex", justifyContent: "center",alignItems: "center"}}>
                {toasts.map(t => (
                    <div key={t.id} style={{ width: "fit-content", background: "#333", color: "#fff", padding: "10px 20px", borderRadius: 5 }}>
                        {t.message}
                    </div>
                ))}
            </div>

        </ToastContext.Provider>
    );

};

export const useToast = () => {
    const context = useContext(ToastContext);
    if(!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
}