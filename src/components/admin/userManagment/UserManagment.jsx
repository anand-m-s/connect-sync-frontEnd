import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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
import { Badge, Box } from '@mui/material';
import { Toaster, toast } from 'sonner';
import { adminAxios } from '../../../constraints/axios/adminAxios';
import adminApi from '../../../constraints/api/adminApi';
import { LockOutlined as LockIcon, CheckCircleOutlined as CheckIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';


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

function UserManagment() {
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
                console.log(res.data)
                setUserData(res.data)
            } catch (error) {
                console.error('error while fetching user data', error);
            }
        }
        fetchUserData()

    }, [])

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

    const handleBlock = async (userId) => {
        const res = await adminAxios.post(`${adminApi.blockunblock}?id=${userId}`)
        res.data.message === 'user blocked' ? toast.error(res.data.message) : toast.success(res.data.message)

        const refreshedUserData = await adminAxios.get(adminApi.getUserData);
        setUserData(refreshedUserData.data)
    }



    return (
        <Box
            flex={6}

        >
            <Toaster richColors />
            {/* <h1 className='flex bg-black p-3 text-slate-50 justify-center '>User Managment</h1> */}
            <h1 className="text-xl font-bold p-7 shadow-sm">User Managment</h1>


            <div className='flex justify-center m-5 items-center  '>
                <TextField
                    type="text"
                    size='small'
                    variant='outlined'
                    label="Search by user name or email"
                    value={search}
                    className='w-80'
                    onChange={(e) => setSearch(e.target.value)}
                />
                <SearchIcon className=" left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            <Box className='p-4'>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, marginBottom: 10 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">#</StyledTableCell>
                                <StyledTableCell align="left">Profie Picture</StyledTableCell>
                                <StyledTableCell align="left">Name</StyledTableCell>
                                <StyledTableCell align="left">Email</StyledTableCell>
                                <StyledTableCell align="left">Status</StyledTableCell>
                                <StyledTableCell align="left">Block/Unblock</StyledTableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUser.length > 0 ? filteredUser.map((user, index) => {
                                return (
                                    <StyledTableRow key={user._id}>
                                        <StyledTableCell align="left">{index + 1}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Avatar alt="Profile picture" src={user.profilePic} />
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{user.userName}</StyledTableCell>
                                        <StyledTableCell align="left">{user.email}</StyledTableCell>
                                        {/* <StyledTableCell align="left">
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </StyledTableCell> */}
                                        <StyledTableCell align="left">
                                            <Badge
                                                color={user.isBlocked ? 'error' : 'success'}
                                                variant="dot"
                                            >
                                                {user.isBlocked ? <LockIcon /> : <CheckIcon />}
                                            </Badge>
                                        </StyledTableCell>
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
        </Box>
    )
}

export default UserManagment