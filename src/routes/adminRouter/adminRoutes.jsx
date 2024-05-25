import { Route, Routes } from "react-router";
import AdminDashboard from "../../pages/admin/adminDashboard";
import Login from "../../pages/admin/adminLogin";
import AdminPrivateRoutes from "./adminPrivateRoutes";



const AdminRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="" element={<AdminPrivateRoutes />}>
                    <Route index element={<AdminDashboard />} />
                </Route>
            </Routes>
        </>
    )
}
export default AdminRoutes