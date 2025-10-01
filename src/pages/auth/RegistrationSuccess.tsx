import styles from "./RegsitrationSuccess.module.css";

export function RegistrationSuccess() {
    return <div className={styles.container}>
        <h1>Signup Successful</h1>
        <p>Your account has been <b>created</b> successfully. A verification email has been sent to your registered email address.
            Please check your inbox and <b>verify</b> your email to activate your account.</p>
    </div>
}