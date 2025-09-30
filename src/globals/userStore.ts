import {create} from 'zustand';
import {persist} from "zustand/middleware";

interface User {
    username: string | null;
    email: string | null;
}

interface UserState {
    user: User;
    setUser: (user: User) => void;
    clearUser: () => void;
}


const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: { username: null, email: null },
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: { username: null, email: null } }),
        }),
        {
            name: 'user-storage', // key in localStorage
        }
    )
);


export default useUserStore;