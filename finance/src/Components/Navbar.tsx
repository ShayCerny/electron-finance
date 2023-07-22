import 'Styles/Navbar.scss';
import { NavLink, Outlet } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <div className="navbar">
                <div className="links">
                    <NavLink className="nav-link" to={'/'}>Dashboard</NavLink>
                    <NavLink className="nav-link" to={'/transactions'}>Transactions</NavLink>
                    <NavLink className="nav-link" to={'/debt-planner'}>Debt Planner</NavLink>
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default Navbar;