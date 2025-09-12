import { Link } from "@tanstack/react-router";
import useUserStore from "@/globals/userStore";

function HamburgerSidebar({show, closeSidebar} : {show: boolean | null, closeSidebar: () => void}) {

    console.log('show is ', show);
    const userStore = useUserStore();
    if(show === null) {
        return <></>;
    }
    let showClassname: string = ''
    if(show !== null) {
        showClassname =  show === true ? 'opened' : 'closed';
    }

    return <div id="hamburgerSidebar" className={`hamburgerSidebar ${showClassname}`}>
        {/* <div><button onClick={() => {closeSidebar()}}>x</button></div> */}
            <ul>
                <li>
                    <Link to="/" onClick={closeSidebar}>Home</Link>
                    
                </li>
                <li>
                    <Link to="/about" onClick={closeSidebar}>About</Link>
                    
                </li>
                <li>
                    <Link to="/models" onClick={closeSidebar}>Models</Link>
                </li>
                <li>
                    <Link to="/data" onClick={closeSidebar}>Data</Link>
                </li>

                {
                    !userStore.user.username && <li>
                    <Link to="/user/login" onClick={closeSidebar}>Login</Link>
                </li>
                }
                
            </ul>
    </div>
}

export default HamburgerSidebar