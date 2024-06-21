import { Route, Routes } from 'react-router'
import { lazy, Suspense } from 'react';
import Signup from '../../pages/user/signup'
import Login from '../../pages/user/Login'
import OtpInput from '../../pages/user/OtpInput'
import Home from '../../pages/user/Home'
import UserPrivateRoutes from './userPrivateRoutes'
// import Profile from '../../pages/user/profile/profile'
const Profile = lazy(() => import('../../pages/user/profile/profile'))
import { ModalProvider } from '../../context/modalContext'
import Chat from '../../pages/user/chat/Chat'
import ForgotPassword from '../../pages/user/ForgotPassword'
import VideoChat from '../../pages/user/videocall/VideoChat'
import { CallProvider } from '../../context/CallContext'
import CallNotification from '../../components/user/Call/CallNotification'

const UserRoutes = () => {
    return (
        <>
            <CallProvider>

                <ModalProvider>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path='/' element={<Signup />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/forgot' element={<ForgotPassword />} />
                            <Route path='/otp' element={<OtpInput />} />
                            <Route path='' element={<UserPrivateRoutes />}>
                                <Route path='/home' element={<Home />} />
                                <Route path='/profile' element={<Profile />} />
                                <Route path='/chat' element={<Chat />} />
                                <Route path='/videoChat' element={<VideoChat />} />
                                <Route path="/video-call/:roomId" element={<VideoChat />} />
                            </Route>
                        </Routes>
                    </Suspense>

                </ModalProvider>
                <CallNotification />
            </CallProvider>
        </>
    )
}


export default UserRoutes