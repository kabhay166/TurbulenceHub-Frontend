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
        return `${this.getBaseUrl()}/user/login`;
    },

    getSignupUrl() {
        return `${this.getBaseUrl()}/user/signup`;
    },

    getDataUrl() {
        return `${this.getBaseUrl()}/data`
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
    }
}

export default AppConfig;