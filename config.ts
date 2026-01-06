type Profile = "DEV" | "PROD";

const PROFILE: Profile = process.env.NODE_ENV === "development" ? "DEV" : "PROD";


const AppConfig = {
    getBaseUrl() {
        switch (PROFILE) {
            case "DEV":
                return "http://localhost:8081";
            case "PROD":
                return "https://turbulencehub.in"
        }
    },

    getLoginUrl() {
        return `/user/login`;
    },

    getSignupUrl() {
        return `/user/signup`;
    },

    getDataUrl() {
        return `/data`
    },

    getAddDataUrl() {
        return `/data/add-data`
    },

    getDownloadUrl(model:string,id:number) {
        return `${this.getBaseUrl()}/data/download/${model}/${id}`
    },

    getRunUrl() {
        switch (PROFILE) {
            case "DEV":
                return "ws://localhost:8081/ws/tarang-demo";
            case "PROD":
                return "wss://turbulencehub.in/ws/tarang-demo"
        }
    },

    getRunOutputUrl() {
        switch (PROFILE) {
            case "DEV":
                return "ws://localhost:8081/ws/get-run-output";
            case "PROD":
                return "wss://turbulencehub.in/ws/get-run-output"
        }
    },

    getPasswordResetUrl() {
        return `/user/reset-password`; //`${this.getBaseUrl()}/user/reset-password`;
    }
}

export default AppConfig;