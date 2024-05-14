import { Route, Routes } from 'react-router'
import Signup from '../../pages/user/signup'
import Login from '../../pages/user/Login'
import OtpInput from '../../pages/user/OtpInput'
import Home from '../../pages/user/Home'
import UserPrivateRoutes from './userPrivateRoutes'


const UserRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/otp' element={<OtpInput />} />
            <Route path='' element={<UserPrivateRoutes />}>
                <Route path='/home' element={<Home />} />
            </Route>
        </Routes>
    )
}


export default UserRoutes