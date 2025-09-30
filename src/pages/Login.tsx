import { Link, useNavigate } from "@tanstack/react-router"
import styles from "./Login.module.css"
import {type FormEvent, useState} from "react";
import useUserStore from "@/globals/userStore";
import PopUp from "@/components/PopUp.tsx";
import {FaArrowLeft} from "react-icons/fa";
import AppConfig from "../../config.ts";

interface  User {
    username:string,
    password:string,
    otp:string | null,
}

export function Login() {

    const userStore = useUserStore();
    const navigate = useNavigate();
    const [showPopUp,setShowPopUp] = useState<boolean>(false);
    const [popUpText,setPopUpText] = useState<string>('');
    const [showOtp,setShowOtp] = useState<boolean>(false);
    const [user,setUser] = useState<User>({username: '',password: '',otp:null})

    async function handleLogin(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const loginResponse = await fetch(AppConfig.getLoginUrl(),{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: user.username,
                    password:user.password,
                    otp: user.otp

                }),
            });

            const responseJson = await loginResponse.json();

            if(loginResponse.ok) {

                console.log("Login was Successfull");

                const username: string = responseJson["username"];
                const email: string = responseJson["email"];
                const token: string = responseJson["token"];
                const showOTPPage: boolean = responseJson["showOTPPage"]
                if(token == "" && showOTPPage == true) {
                    setShowOtp(true);
                    return;
                }

                localStorage.setItem('token',token);
                console.log(username,email,token);
                userStore.setUser({username: username, email: email});
                setShowPopUp(true);
                await navigate({to: "/"});
            } else {
                const errorMessage = responseJson["error"]
                setPopUpText(errorMessage);
                setShowPopUp(true);
                console.log("Could not log in");
            }

        } catch(e:unknown) {
            console.log(`An error occured: ${e}`);
        }
    }

    function handleUsernameChange(username:string) {
        setUser(
            {
                ...user,
                ['username']: username
            }
        )
        // setUsername(username);
    }

    function handlePasswordChange(password:string) {
        setUser(
            {
                ...user,
                ['password']: password
            }
        )
        // setPassword(password);
    }

    function handleOtpChange(otp:string) {
        setUser({
            ...user,
            ['otp']: otp
        })
    }

    function handleOTPPageClose() {
        setShowOtp(false);
    }

    return <div className={styles.container}>
        <div className={styles.loginContainer}>
            <h1>Login</h1>

            {!showOtp && <LoginForm handleLogin={handleLogin} username={user.username} password={user.password} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} showPopUp={showPopUp} popUpText={popUpText} />
            }

            {showOtp && <OtpForm otp={user.otp} handleLogin={handleLogin} handleOtpChange={handleOtpChange} handleOTPPageClose={handleOTPPageClose} /> }

        </div>
    </div>
}


function LoginForm({handleLogin,username,handleUsernameChange,password,handlePasswordChange,showPopUp,popUpText} :
                   {handleLogin: (e: FormEvent<HTMLFormElement>) => Promise<void>, username:string,handleUsernameChange: (username:string) => void,password:string,handlePasswordChange: (password:string) => void, showPopUp: boolean,popUpText:string }) {
    return <>
    <form action="" method="post" onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" value={username} onChange={(e) => handleUsernameChange(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" value={password} onChange={(e) => handlePasswordChange(e.target.value)} />
        <button type="submit" className={styles.loginButton}>
            Log In
        </button>
    </form>
    { showPopUp && <PopUp message={popUpText} /> }
    <Link to="/user/signup">Don't have an account? Click here to Sign up.</Link>
    </>;
}

function OtpForm({otp,handleOtpChange,handleLogin, handleOTPPageClose} : {otp:string|null,handleOtpChange: (otp:string) => void,handleLogin: (e: FormEvent<HTMLFormElement>) => Promise<void>,handleOTPPageClose: () => void}) {
    return <div className={styles.otpContainer}>
        <p>An otp has been sent to your registered email.</p>
        <h3>Enter the otp</h3>
        <form action="" onSubmit={handleLogin}>
            <input type="text" value={otp == null ? '' : otp} onChange={(e) => handleOtpChange(e.target.value)} />
            <button type="submit" className={styles.loginButton}>Log In</button>
        </form>
        {/*<button>Re-send otp</button>*/}
        <button onClick={handleOTPPageClose}> <FaArrowLeft /> Go back</button>

    </div>
}