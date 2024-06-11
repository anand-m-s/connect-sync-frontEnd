import { Route, Routes } from "react-router";
import AdminDashboard from "../../pages/admin/adminDashboard";
import Login from "../../pages/admin/adminLogin";
import AdminPrivateRoutes from "./adminPrivateRoutes";
import ManageUser from "../../pages/admin/userManagment";
import Report from "../../pages/admin/report";




const AdminRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="" element={<AdminPrivateRoutes />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="user-management" element={<ManageUser/>} />
                    <Route path="report" element={<Report/>} />
                </Route>
            </Routes>
        </>
    )
}
export default AdminRoutes