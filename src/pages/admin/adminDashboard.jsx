import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/redux/slices/adminAuthSlice';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import { adminAxios } from '../../constraints/axios/adminAxios';
import adminApi from '../../constraints/api/adminApi';
import { Box } from '@mui/material';
import { Toaster, toast } from 'sonner';




const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userData, setUserData] = useState([])
  const [filteredUser, setFilteredUser] = useState([]);
  const selectAdmin = (state) => state.adminAuth.adminInfo;
  const admin = useSelector(selectAdmin);
  const [search, setSearch] = useState('')
  if (!admin) {
    navigate('/admin/login')
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await adminAxios.get(adminApi.getUserData)
        setUserData(res.data)       
      } catch (error) {
        console.error('error while fetching user data', error);
      }
    }
    fetchUserData()

  }, [])



  // const filteredUser = userData?.filter(user => {
  //   const userName = user.userName.toLowerCase()
  //   const userEmail = user.email.toLowerCase()
  //   const findUser = search.toLowerCase()
  //   return userName.includes(findUser) || userEmail.includes(findUser)
  // })
  useEffect(() => {
    const filterUsers = () => {
      const filtered = userData.filter(user => {
        const userName = user.userName.toLowerCase();
        const userEmail = user.email.toLowerCase();
        const findUser = search.toLowerCase();
        return userName.includes(findUser) || userEmail.includes(findUser);
      });
      setFilteredUser(filtered);
    };
    filterUsers();
  }, [search, userData]);

  const handleBlock = async(userId) => {
      const res = await adminAxios.post(`${adminApi.blockunblock}?id=${userId}`)
      console.log(res.data)
      toast.success(res.data.message)
      const refreshedUserData = await adminAxios.get(adminApi.getUserData);
      setUserData(refreshedUserData.data)
  }
  const handleLogout = ()=>{
    dispatch(logout())
    toast.info('logout success')
  }


  return (
    <>
    <Toaster richColors/>
      <h1 className='flex bg-black p-3 text-slate-50 justify-center '>AdminDashboard</h1>
      <div className=' m-2 flex justify-end'>
        <Button  variant='contained' size='small' onClick={handleLogout}>Logout</Button>
      </div>
    
      <div className='flex justify-center m-5 items-center'>
        <TextField
          type="text"
          size='small'
          variant='outlined'
          label="Search by user name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Box className='p-12'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700, marginBottom: 10 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">#</StyledTableCell>
                <StyledTableCell align="left">Profie Picture</StyledTableCell>
                <StyledTableCell align="left">Name</StyledTableCell>
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">Block/Unblock</StyledTableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUser.length > 0 ? filteredUser.map((user, index) => {
                const imageURL = ``;
                return (
                  <StyledTableRow key={user._id}>
                    <StyledTableCell align="left">{index + 1}</StyledTableCell>
                    <StyledTableCell align="left">
                      <Avatar alt="Profile picture" src={imageURL} />
                    </StyledTableCell>
                    <StyledTableCell align="left">{user.userName}</StyledTableCell>
                    <StyledTableCell align="left">{user.email}</StyledTableCell>
                    <StyledTableCell align="left">
                      <Button
                        variant={!user.isBlocked ? 'outlined' : 'contained'}
                        color={!user.isBlocked ? 'error' : 'success'}
                        style={{ width: '100px' }}
                        onClick={() => handleBlock(user._id)}
                      >
                        {!user.isBlocked ? 'Block' : 'Unblock'}
                      </Button>

                    </StyledTableCell>

                  </StyledTableRow>
                );
              }) :
                <StyledTableRow>
                  <StyledTableCell align="left">
                    <h3>No User Found!</h3>
                  </StyledTableCell>
                </StyledTableRow>}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>
    </>
  )
}

export default AdminDashboard