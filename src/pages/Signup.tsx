import { useState } from "react";
import styles from "./Signup.module.css"
import { Link } from "@tanstack/react-router";
import useUserStore from "@/globals/userStore";
import { useNavigate } from "@tanstack/react-router";

export function Signup() {

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [email,setEmail] = useState("");
    const userStore = useUserStore();
    const navigate = useNavigate();

    async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(confirmPassword != password) {
            return;
        }

        try {
        const signupResult: Response = await fetch("http://localhost:8081/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            })
        });
        
        if(signupResult.ok) {
            console.log("User created");
            const user = await signupResult.json();
            const username: string = user["username"];
            const email: string = user["email"];
            const token: string = user["token"];
            console.log(username,email,token);
            userStore.setUser({username: username, email: email, token: token});
            navigate({ to: "/" });
        }
        
        } catch(e: unknown) {
            console.log(`Unexpected error occured. ${e}`);
        }
    }

    return <div className={styles.container}>
        <div className={styles.signupContainer}>
            <h1>Create your account</h1>
            <form action="" method="post" onSubmit={handleSignup}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" name="confirm-password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="submit" >
                    Sign Up
                </button>
            </form>
            <Link to="/user/login">Already have an account? Click here to Log in.</Link>
        </div>
    </div>
}