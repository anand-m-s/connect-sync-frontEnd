import {Route,Routes} from 'react-router'
import Signup from '../../pages/user/signup'
import Login from '../../pages/user/Login'


const UserRoutes =()=>{
    return(
        <Routes>
            <Route path='/' element={<Signup/>}/>
            <Route path='/login' element={<Login/>}/>
        
        </Routes>
    )
}


export default UserRoutes