import { useUser } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import SideMenu from "../components/SideMenu.jsx";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useUser();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar activeMenu={activeMenu} />
            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                    <motion.div
                        key={activeMenu}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="grow min-w-0"
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
