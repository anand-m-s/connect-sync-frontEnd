import React, { useMemo, useState } from 'react';
import { TextField, Button, Avatar, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControlLabel, Menu, MenuItem, IconButton, Box, Tooltip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { adminAxios } from '../../../constraints/axios/adminAxios';
import adminApi from '../../../constraints/api/adminApi';
import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import AlertDialogSlide from '../../common/SlideInAlert';
import Badge from '@mui/material/Badge';

export default function PostReport() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState({ key: "id", order: "asc" });
    const [filters, setFilters] = useState({
        status: [],
        reason: [],
    });
    const [anchorEl, setAnchorEl] = useState(null);

    const [reportData, setReportData] = useState([])
    const [refreshReports, setRefreshReports] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const fetchReport = async () => {
        try {
            const res = await adminAxios.get(adminApi.getReport)
            // console.log(res)
            console.log(res.data)
            setReportData(res.data)

        } catch (error) {
            console.error('error while fetching user data', error);
        }
    }

    const handleBanPost = async () => {
        
        try {
            const res = await adminAxios.post(`${adminApi.blockPost}?postId=${selectedPostId}`)
            console.log(res.data)
            toast.success(res.data.message)
            setRefreshReports((prev) => !prev)
            handleCloseDialog();
        } catch (error) {
            console.error('error while block post', error);
        }
    };

    const handleOpenDialog = (postId) => {
        setSelectedPostId(postId);
        setDialogOpen(true);
      };
    
      const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPostId(null);
      };

    useEffect(() => {
        fetchReport()
    }, [])
    useEffect(() => {
        fetchReport()
    }, [refreshReports])
    // console.log(reportData)

    // const reportedPosts = useMemo(
    //     () =>
    //         reportData
    //             .filter((post) => {
    //                 const searchValue = search.toLowerCase();
    //                 return (
    //                     post.content.toLowerCase().includes(searchValue) ||
    //                     post.user.toLowerCase().includes(searchValue) ||
    //                     post.reportedBy.toLowerCase().includes(searchValue) ||
    //                     post.reason.toLowerCase().includes(searchValue) ||
    //                     post.status.toLowerCase().includes(searchValue)
    //                 );
    //             })
    //             .filter((post) => {
    //                 if (filters.status.length > 0) {
    //                     return filters.status.includes(post.status);
    //                 }
    //                 return true;
    //             })
    //             .filter((post) => {
    //                 if (filters.reason.length > 0) {
    //                     return filters.reason.includes(post.reason);
    //                 }
    //                 return true;
    //             })
    //             .sort((a, b) => {
    //                 if (sort.order === "asc") {
    //                     return a[sort.key] > b[sort.key] ? 1 : -1;
    //                 } else {
    //                     return a[sort.key] < b[sort.key] ? 1 : -1;
    //                 }
    //             }),
    //     [search, sort, filters]
    // );
    // // console.log(reportedPosts)

    const handleSearch = (e) => setSearch(e.target.value);

    const handleSort = (key) => {
        if (sort.key === key) {
            setSort({ key, order: sort.order === "asc" ? "desc" : "asc" });
        } else {
            setSort({ key, order: "asc" });
        }
    };

    // const handleFilterChange = (type, value) => {
    //     if (type === "status") {
    //         setFilters({
    //             ...filters,
    //             status: filters.status.includes(value)
    //                 ? filters.status.filter((item) => item !== value)
    //                 : [...filters.status, value],
    //         });
    //     } else if (type === "reason") {
    //         setFilters({
    //             ...filters,
    //             reason: filters.reason.includes(value)
    //                 ? filters.reason.filter((item) => item !== value)
    //                 : [...filters.reason, value],
    //         });
    //     }
    // };



    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            flex={6}
        >
            <Toaster richColors />

            <div className="flex flex-col h-full">
                <header className="bg-white shadow-sm p-4 md:p-6 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Reported Posts</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <TextField
                                type="search"
                                placeholder="Search reported posts..."
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={handleSearch}
                                style={{ paddingLeft: '30px', width: '300px' }}
                            />
                        </div>
                        <div>
                            <IconButton onClick={handleMenuClick}>
                                <FilterListIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem disabled>Filters</MenuItem>
                                <MenuItem>
                                    <FormControlLabel
                                        control={<Checkbox checked={filters.status.includes("pending")} onChange={() => handleFilterChange("status", "pending")} />}
                                        label="Pending"
                                    />
                                </MenuItem>
                                <MenuItem>
                                    <FormControlLabel
                                        control={<Checkbox checked={filters.status.includes("resolved")} onChange={() => handleFilterChange("status", "resolved")} />}
                                        label="Resolved"
                                    />
                                </MenuItem>
                                <MenuItem>
                                    <FormControlLabel
                                        control={<Checkbox checked={filters.status.includes("dismissed")} onChange={() => handleFilterChange("status", "dismissed")} />}
                                        label="Dismissed"
                                    />
                                </MenuItem>
                                <MenuItem>
                                    <FormControlLabel
                                        control={<Checkbox checked={filters.reason.includes("Inappropriate content")} onChange={() => handleFilterChange("reason", "Inappropriate content")} />}
                                        label="Inappropriate content"
                                    />
                                </MenuItem>
                                <MenuItem>
                                    <FormControlLabel
                                        control={<Checkbox checked={filters.reason.includes("Spam")} onChange={() => handleFilterChange("reason", "Spam")} />}
                                        label="Spam"
                                    />
                                </MenuItem>
                                <MenuItem>
                                    <FormControlLabel
                                        control={<Checkbox checked={filters.reason.includes("Offensive language")} onChange={() => handleFilterChange("reason", "Offensive language")} />}
                                        label="Offensive language"
                                    />
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="cursor-pointer" onClick={() => handleSort("id")}>
                                        ID {sort.key === "id" && <span>{sort.order === "asc" ? "↑" : "↓"}</span>}
                                    </TableCell>
                                    <TableCell className="cursor-pointer" onClick={() => handleSort("content")}>
                                        Content {sort.key === "content" && <span>{sort.order === "asc" ? "↑" : "↓"}</span>}
                                    </TableCell>
                                    <TableCell className="cursor-pointer" onClick={() => handleSort("user")}>
                                        User {sort.key === "user" && <span>{sort.order === "asc" ? "↑" : "↓"}</span>}
                                    </TableCell>
                                    <TableCell className="cursor-pointer" onClick={() => handleSort("reportedBy")}>
                                        Reported By {sort.key === "reportedBy" && <span>{sort.order === "asc" ? "↑" : "↓"}</span>}
                                    </TableCell>
                                    <TableCell className="cursor-pointer" onClick={() => handleSort("reason")}>
                                        Reason {sort.key === "reason" && <span>{sort.order === "asc" ? "↑" : "↓"}</span>}
                                    </TableCell>
                                    <TableCell className="cursor-pointer" onClick={() => handleSort("status")}>
                                        Status {sort.key === "status" && <span>{sort.order === "asc" ? "↑" : "↓"}</span>}
                                    </TableCell>
                                    <TableCell className="cursor-pointer" onClick={() => handleSort("status")}>
                                        additionalReason {sort.key === "status" && <span>{sort.order === "asc" ? "↑" : "↓"}</span>}
                                    </TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData.map((post, i) => (
                                    <TableRow key={post._id}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>
                                            {post.postId.imageUrl && (
                                                // <Badge badgeContent={post.users.length} color='error' >

                                                // <img src={post.postId.imageUrl} alt="post image" className="w-24 h-24 rounded-md" />
                                                // </Badge>
                                                <Tooltip
                                                title={
                                                  <div>
                                                    <p>Reported Users:</p>
                                                    {post.users.map(user => (
                                                      <p key={user.userId}>{user.userId.userName} <br /> {user.reason} <br /> {user.additionalReason}</p>
                                                    ))}
                                                  </div>
                                                }
                                                arrow
                                              >
                                                <Badge badgeContent={post.users.length} color="error">
                                                 <img src={post.postId.imageUrl} alt="post image" className="w-24 h-24 rounded-md" />
                                                </Badge>
                                              </Tooltip>
                                            )}
                                            {/* <div >{post.users[0].additionalReason}</div> */}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar alt={post.user} src={post.postId.userId.profilePic} />
                                                <span>{post.postId.userId.userName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar alt={post.user} src={post.users[0].userId.profilePic} />
                                                <span>{post.users[0].userId.userName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{post.users[0].reason}</TableCell>
                                        <TableCell>{post.postId.isBlocked ? 'Banned' : 'Active'}</TableCell>
                                        <TableCell>{post.users[0].additionalReason}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {!post.postId.isBlocked ? (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            // onClick={() => handleBanPost(post.postId._id)}
                                                            onClick={()=>handleOpenDialog(post.postId._id)}
                                                        >
                                                            Ban
                                                        </Button>

                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        size="small"
                                                        // onClick={() => handleBanPost(post.postId._id)}
                                                        onClick={()=>handleOpenDialog(post.postId._id)}
                                                    >
                                                        Unban
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <AlertDialogSlide
                        open={dialogOpen}
                        handleClose={handleCloseDialog}
                        handleConfirm={handleBanPost}
                        message="Are you sure you want to ban/unban this post?"
                    />
                </main>
            </div>
        </Box>
    );
}
