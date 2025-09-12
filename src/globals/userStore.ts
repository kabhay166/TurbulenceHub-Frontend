import {create} from 'zustand';


interface User {
    username: string | null;
    email: string | null;
    token: string | null;
}

interface UserState {
    user: User;
    setUser: (user: User) => void;
    clearUser: () => void;
    setToken: (token: string) => void;
}

const useUserStore = create<UserState>((set) => ({
    user:  {username: null, email: null, token: null},
    setUser: (user) => set({user}),
    clearUser: () => set({user: {username: null, email: null, token: null}}),
    setToken: (token) => set((state) => ({user: {...state.user, token}})),


}));

export default useUserStore;