import styles from "./PasswordReset.module.css";
import {ToastTypes} from "@/contexts/ToastContext.tsx";
import {useToast} from "@/hooks/UseToast.tsx";
import AppConfig from "../../../config.ts";
import {useState} from "react";
import {useSearch} from "@tanstack/react-router";
import api from "@/services/api_service.ts";

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
                addToast(`Email cannot be empty`,ToastTypes.warning);
            }
            try {
                const resetLinkResponse = await api.post(
                    AppConfig.getPasswordResetUrl(),
                    {
                        email: userEmail
                    },
                    );


                const responseJson = await resetLinkResponse.data;

                if(resetLinkResponse.status == 200) {
                    setResetMailSent(true);
                } else {
                    const errorMessage = responseJson["error"];
                    addToast(errorMessage,ToastTypes.error);
                }

            } catch(e:unknown) {
                addToast(`An error occured: ${e}`,ToastTypes.error)
            }

    }

    async function handleChangePasswordButtonClicked(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if(newPassword != confirmNewPassword) {
            addToast("The passwords do no match",ToastTypes.error);
            return;
        }

        if(token == null) {
            addToast(`Reset token not found`,ToastTypes.error);
            return;
        }
        try {
            const passwordChangeResponse = await api.post(AppConfig.getPasswordResetUrl(),
                {
                    token: token,
                    password: newPassword,
                    confirmPassword: confirmNewPassword
                }
            );

            const responseJson = await passwordChangeResponse.data;

            if(passwordChangeResponse.status == 200) {
                setPasswordChanged(true);
            } else {
                const errorMessage = responseJson["error"];
                addToast(errorMessage,ToastTypes.error);
            }

        } catch(e:unknown) {
            addToast(`An error occured: ${e}`,ToastTypes.error);
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
