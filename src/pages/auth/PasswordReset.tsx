import styles from "./PasswordReset.module.css";

export default function PasswordReset() {


    function handleResetButtonClicked(e:React.FormEvent<HTMLFormElement>) {
            e.preventDefault();

    }

    return <div className={styles.container}>
        <h1>Reset password</h1>
        <p>Enter your email to receive password reset link</p>
        <form action="">
            <input type="text" placeholder="Enter your email" />
            <br/>
            <button type="submit">Send Reset Link</button>
        </form>
    </div>
}