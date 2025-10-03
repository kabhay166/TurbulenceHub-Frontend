import { Link } from "@tanstack/react-router";
import useUserStore from "@/globals/userStore";
import { CgProfile } from "react-icons/cg";

function NavBar({toggleSidebar} : {toggleSidebar: () => void}) {
    
    const userStore = useUserStore();
    console.log('Username is: ' + userStore.user.username);
    return (
        <nav id="navbar">

            {/*<h2>TurbulenceHub</h2>*/}

            <h2><span style={{color:'orange'}}>T</span>urbulence<span style={{color:'orange'}}>H</span>ub</h2>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                    
                </li>
                <li>
                    <Link to="/about">About</Link>
                    
                </li>
                <li>
                    <Link to="/models">Models</Link>
                </li>
                <li>
                    <Link to="/data">Data</Link>
                </li>

                {
                    !userStore.user.username && <li>
                    <Link to="/user/login">Login</Link>
                </li>
                }

                <li>
                    {
                        userStore.user.username && <UserMenuItems toggleSidebar={toggleSidebar} />
                    }
                </li>


                
                
            </ul>
        </nav>
    )
}



function UserMenuItems({toggleSidebar}: {toggleSidebar: () => void}) {
    return <div className="userMenuItems">
        <CgProfile size={25} color="white" onClick={toggleSidebar} />
    </div>;
}


export default NavBar
