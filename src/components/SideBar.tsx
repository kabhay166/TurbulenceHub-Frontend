import useUserStore from "@/globals/userStore";

export default function SideBar({show, closeSidebar} : {show: boolean | null, closeSidebar: () => void}) {
    console.log('show is ', show);
    const userStore = useUserStore();
    if(show === null) {
        return <></>;
    }
    let showClassname: string = ''
    if(show !== null) {
        showClassname =  show === true ? 'opened' : 'closed';
    }
    

    function logout() {
        closeSidebar();
        userStore.clearUser();
    }
    return <div className={`menuItems ${showClassname}`}>
        <div><button onClick={() => {closeSidebar()}}>x</button></div>
        <ul >
            <li><button onClick={logout}>Logout</button></li>
            <li>Settings</li>
        </ul>
    </div>
}