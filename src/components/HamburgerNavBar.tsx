import useUserStore from "@/globals/userStore";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
function HamburgerNavBar({isOpen,toggleSidebar} : {isOpen: boolean,toggleSidebar: () => void}) {
    
    const userStore = useUserStore();
    console.log('Username is: ' + userStore.user.username);
    return (
        <nav id="hamburgerNavbar">
            {isOpen ?
            <FaTimes color="white" size={28} onClick={toggleSidebar} />
            : <FaBars color="white" size={28} onClick={toggleSidebar} />
            }
        </nav>
    )
}

export default HamburgerNavBar
