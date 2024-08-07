import { Route, Routes, useNavigate } from 'react-router'
import { lazy, Suspense, useEffect } from 'react';
import Signup from '../../pages/user/signup'
import Login from '../../pages/user/Login'
import OtpInput from '../../pages/user/OtpInput'
import Home from '../../pages/user/Home'
import UserPrivateRoutes from './userPrivateRoutes'
const Profile = lazy(() => import('../../pages/user/profile/profile'))
import { ModalProvider } from '../../context/modalContext'
import Chat from '../../pages/user/chat/Chat'
import ForgotPassword from '../../pages/user/ForgotPassword'
import VideoChat from '../../pages/user/videocall/VideoChat'
import { CallProvider } from '../../context/CallContext'
import SocketConn from '../../components/user/Call/CallNotification';
import { setupInterceptors } from '../../constraints/axios/userAxios';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/redux/slices/userAuthSlice';
import { toast, Toaster } from 'sonner';
import { OnlineUsersProvider } from '../../context/OnlineUsers';
import SavedPost from '../../pages/user/savedPost/SavedPost';
import { ColorModeProvider } from '../../context/colorModeContext';
import ChatProvider from '../../context/ChatProvider';
import Meditation from '../../pages/user/meditaion/MeditationHome';
import BlockedUsers from '../../pages/user/blockedUsers/BlockedUsers';
import NotFound from '../../components/common/notFound/NotFound';


const UserRoutes = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        setupInterceptors(navigate, dispatch, logout, toast);
    }, [navigate, dispatch]);


    return (
        <>
            <Toaster richColors />
            <ColorModeProvider>
                <ChatProvider>
                    <CallProvider>
                        <OnlineUsersProvider>
                            <ModalProvider>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Routes>
                                        <Route path='/' element={<Signup />} />
                                        <Route path='/login' element={<Login />} />
                                        <Route path='/forgot' element={<ForgotPassword />} />
                                        <Route path='/otp' element={<OtpInput />} />
                                        <Route path="/*" element={<NotFound />} />
                                        <Route path='' element={<UserPrivateRoutes />}>
                                            <Route path='/home' element={<Home />} />
                                            <Route path='/profile' element={<Profile />} />
                                            <Route path='/chat' element={<Chat />} />
                                            <Route path="/video-call/:roomId" element={<VideoChat />} />
                                            <Route path="/savedPost" element={<SavedPost />} />
                                            <Route path="/meditation" element={<Meditation />} />
                                            <Route path="/blockedUsers" element={<BlockedUsers />} />

                                        </Route>
                                    </Routes>
                                </Suspense>
                            </ModalProvider>
                            <SocketConn />
                        </OnlineUsersProvider>
                    </CallProvider>
                </ChatProvider>
            </ColorModeProvider>
        </>
    )
}


export default UserRoutes