import { Link, useNavigate } from "@tanstack/react-router"
import styles from "./Login.module.css"
import { useState } from "react";
import useUserStore from "@/globals/userStore";

export function Login() {


    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const userStore = useUserStore();
    const navigate = useNavigate();

    async function handleLogin(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const loginResponse = await fetch("http://localhost:8081/user/login",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password:password

                }),
            });

            if(loginResponse.ok) {
                console.log("User created");
                const user = await loginResponse.json();
                const username: string = user["username"];
                const email: string = user["email"];
                const token: string = user["token"];
                console.log(username,email,token);
                userStore.setUser({username: username, email: email, token: token});
                navigate({ to: "/" });
            } else {
                console.log("Could not log in");
            }

        } catch(e:unknown) {
            console.log(`An error occured: ${e}`);
        }
    }

    return <div className={styles.container}>
        <div className={styles.loginContainer}>
            <h1>Login</h1>
            <form action="" method="post" onSubmit={handleLogin}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">
                    Log In
                </button>
            </form>
            <Link to="/user/signup">Don't have an account? Click here to Sign up.</Link>
        </div>
    </div>
}