import { Route, Routes, useNavigate } from "react-router";
import AdminDashboard from "../../pages/admin/adminDashboard";
import Login from "../../pages/admin/adminLogin";
import AdminPrivateRoutes from "./adminPrivateRoutes";
import ManageUser from "../../pages/admin/userManagment";
import Report from "../../pages/admin/report";
import { useEffect } from "react";
import { setupInterceptors } from "../../constraints/axios/adminAxios";
import { logout } from "../../services/redux/slices/adminAuthSlice";
import { useDispatch } from "react-redux";
import { toast, Toaster } from "sonner";
import AddCourse from "../../pages/admin/addCourse";
import { SidebarProvider } from "../../context/SideBarHighLight";
import NotFound from "../../components/common/notFound/NotFound";




const AdminRoutes = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        setupInterceptors(navigate, dispatch, logout, toast);
    }, [navigate, dispatch]);
    return (
        <>
            <Toaster richColors />
            <SidebarProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<NotFound/>} />
                <Route path="" element={<AdminPrivateRoutes />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="user-management" element={<ManageUser />} />
                    <Route path="report" element={<Report />} />
                    <Route path="addcourse" element={<AddCourse />} />
                </Route>
            </Routes>
            </SidebarProvider>
        </>
    )
}
export default AdminRoutes