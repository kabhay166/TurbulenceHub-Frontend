import {createContext, type ReactNode, useState} from "react";

interface Toast {
    id:number;
    message:string;
    type:ToastType
}

export const ToastTypes = {
    normal: "normal",
    success: "success",
    warning: "warning",
    error: "error",
} as const

export type ToastType = keyof typeof ToastTypes;

interface ToastContextType {
    toasts: Toast[];
    addToast: (message:string,type:ToastType) => void;
    removeToast: (id:number) => void;
}

const ToastDisplayTime = 3000;
export const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider = ({children} : {children:ReactNode}) => {

    const [toasts,setTosts] = useState<Toast[]>([]);

    const addToast = (message:string,type:ToastType= ToastTypes.normal) => {
        const id = ++toastId;
        setTosts(prev => [...prev, {id,message,type}]);
        setTimeout(() => removeToast(id),ToastDisplayTime)
    }

    const removeToast = (id:number) => {
        setTosts(prev => prev.filter(t => t.id !== id))
    }

    function getToastColor(type:ToastType) {
        return type == ToastTypes.normal ? "black" : type == ToastTypes.warning ? "yellow" :
            type == ToastTypes.success ? "green" : "red";
    }


    return (
        <ToastContext.Provider value={{toasts, addToast, removeToast}}>
            {children}
            <div style={{position: "fixed", top:100,left:0,right:0, zIndex:999,display: "flex", justifyContent: "center",alignItems: "center"}}>
                {toasts.map(t => (
                    <div key={t.id} style={{ width: "fit-content", background: getToastColor(t.type), color: "white", padding: "10px 20px", borderRadius: 5 }}>
                        {t.message}
                    </div>
                ))}
            </div>

        </ToastContext.Provider>
    );

};

