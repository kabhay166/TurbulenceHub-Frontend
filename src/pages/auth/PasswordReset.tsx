import styles from "./PasswordReset.module.css";
import {useToast} from "@/contexts/ToastContext.tsx";
import AppConfig from "../../../config.ts";
import {useState} from "react";
import {useSearch} from "@tanstack/react-router";

export default function PasswordReset() {

    const {addToast} = useToast();
    const [userEmail,setUserEmail] = useState<string>("");
    const [resetMailSent,setResetMailSent] = useState<boolean>(false);
    const [newPassword,setNewPassword] = useState<string>("");
    const [confirmNewPassword,setConfirmNewPassword] = useState<string>("");
    const [passwordChanged,setPasswordChanged] = useState<boolean>(false);
    const searchParams = useSearch({
        from: '/user/reset-password'
    });

    // @ts-ignore
    const token = searchParams["token"] ?? '';


    console.log('token is: ',token);

    function handleUserEmailChange(newUserEmail:string) {
        setUserEmail(newUserEmail);
    }


    async function handleResetButtonClicked(e:React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
            if(userEmail === "") {
                addToast(`Email cannot be empty`);
            }
            try {
                const resetLinkResponse = await fetch(AppConfig.getPasswordResetUrl(),{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: userEmail
                    })
                });

                const responseJson = await resetLinkResponse.json();

                if(resetLinkResponse.ok) {
                    setResetMailSent(true);
                } else {
                    const errorMessage = responseJson["error"];
                    addToast(errorMessage);
                }

            } catch(e:unknown) {
                addToast(`An error occured: ${e}`)
            }

    }

    async function handleChangePasswordButtonClicked(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if(newPassword != confirmNewPassword) {
            addToast("The passwords do no match");
            return;
        }

        if(token == null) {
            addToast(`Reset token not found`);
            return;
        }
        try {
            const passwordChangeResponse = await fetch(AppConfig.getPasswordResetUrl(),{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    password: newPassword,
                    confirmPassword: confirmNewPassword
                })
            });

            const responseJson = await passwordChangeResponse.json();

            if(passwordChangeResponse.ok) {
                setPasswordChanged(true);
            } else {
                const errorMessage = responseJson["error"];
                addToast(errorMessage);
            }

        } catch(e:unknown) {
            addToast(`An error occured: ${e}`)
        }

    }

    return <div className={styles.container}>
        <h1>Reset password</h1>
        {token == "" && <>
            {!resetMailSent && <>
                <p>Enter your email to receive password reset link.</p>
                <form action="" onSubmit={handleResetButtonClicked}>
                    <input type="text" placeholder="Enter your email" value={userEmail} onChange={(e) => {handleUserEmailChange(e.target.value)}} />
                    <br/>
                    <button type="submit">Send Reset Link</button>
                </form> </>
            }

            {resetMailSent &&
                <p>An email with password reset link has been sent to your email address. Please check and continue from there.</p>
            }

        </>
        }

        { (token != "" && passwordChanged == false) &&

            <form className={styles.resetPasswordContainer} onSubmit={handleChangePasswordButtonClicked} >
                <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <input type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                <button type="submit" >Change Password</button>
            </form>
        }

        {passwordChanged == true &&
            <p>You password has been successfully changed</p>

        }

    </div>
}
