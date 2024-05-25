import { useSelector } from "react-redux";
import { Navigate,Outlet } from "react-router";

const AdminPrivateRoutes = ()=>{
    const {adminInfo} = useSelector((state)=>state.adminAuth)
    return(

        adminInfo?<Outlet/>:<Navigate to={'/admin/login'}/>
    )
}

export default AdminPrivateRoutes