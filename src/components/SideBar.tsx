import useUserStore from "@/globals/userStore";
import {Link, useNavigate} from "@tanstack/react-router";
import {FaTimes} from "react-icons/fa";

export default function SideBar({show, closeSidebar} : {show: boolean | null, closeSidebar: () => void}) {
    console.log('show is ', show);

    const navigate = useNavigate();
    const userStore = useUserStore();
    if(show === null) {
        return <></>;
    }
    let showClassname: string = ''
    if(show !== null) {
        showClassname =  show === true ? 'opened' : 'closed';
    }
    

    async function logout(){
        closeSidebar();
        localStorage.removeItem("accessToken");
        userStore.clearUser();
        await navigate({to: "/"});

    }


    return <div className={`menuItems ${showClassname}`}>
        <div><button onClick={() => {closeSidebar()}}> <FaTimes color={'white'} /> </button></div>
        <ul>
            <li><button ><Link to="/active-runs">Active Runs</Link></button></li>
            <li><button ><Link to="/dashboard">Dashboard</Link></button></li>
            <li>Settings</li>
            <li><button onClick={logout}>Logout</button></li>

        </ul>
    </div>
}