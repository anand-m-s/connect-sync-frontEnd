import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Link, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';


const SharedFiles = ({ files, sender, t }) => {
    const user = useSelector((state) => state.userAuth.userInfo);
    const [showControls, setShowControls] = useState(false);
   
    return (
        <Grid container direction='column' spacing={0} className={`flex items-end gap-2 ${sender === user.id ? 'justify-end' : ''}`}>
            {files.map((file) => (
                <Grid item xs={6} sm={4} key={file._id}  >
                    <Card sx={{ bgcolor: 'background.paper', borderRadius: 2 }} elevation={0}>
                        <CardContent  >
                            {file.contentType.startsWith('image/') ? (
                                <>
                                    <CardMedia
                                        component="img"
                                        src={file.fileLink}
                                        alt={file._id}
                                        sx={{
                                            width: 250,
                                            height: 150,
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'scale(1.05)' },
                                            objectFit: 'contain'
                                        }}
                                    />
                                    <p className='mr-1 p-1 text-grey-200 text-xs flex justify-end'> {new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </>
                            ) : file.contentType === 'application/pdf' ? (
                                // <>
                                //     <CardContent>
                                //         <embed
                                //             src={file.fileLink}
                                //             type="application/pdf"
                                //             width="100%"
                                //             height="250px"
                                //             style={{ borderRadius: 2, cursor: 'pointer' }}                                                                                        
                                //         />
                                //         {/* <Link href={file.fileLink} download>
                                //             Download
                                //         </Link> */}
                                //     </CardContent>
                                //     <p className='mr-1 p-1 text-grey-200 text-xs flex justify-end'> {new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                // </>
                                <>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            bgcolor: 'background.default',
                                            borderRadius: 2,
                                            padding: 2,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <PictureAsPdfIcon  sx={{ fontSize: 45, color: 'error.main' }} className='border' />
                                        <Typography variant="body1" component="div" sx={{ flex: 1, ml: 2 }}>
                                            {file.fileName}
                                        </Typography>
                                        <Link href={file.fileLink} target="_blank" rel="noopener noreferrer">
                                            <Typography variant="body2" color="primary">
                                                Open
                                            </Typography>
                                        </Link>
                                    </Box>
                                </CardContent>
                                <p className='mr-1 p-1 text-grey-200 text-xs flex justify-end'>
                                    {new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </>
                            ) : file.contentType.startsWith('video/') ? (
                                <>
                                    <CardMedia
                                        component="video"
                                        src={file.fileLink}
                                        controls={showControls}
                                        onMouseEnter={() => setShowControls(true)}
                                        onMouseLeave={() => setShowControls(false)}
                                        sx={{
                                            width: 250,
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'scale(1.05)' }
                                        }}
                                    />
                                    <p className='mr-1 p-1 text-grey-200 text-xs flex justify-end'> {new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        width: 200,
                                        height: 200,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 2,
                                        border: '1px solid #ccc',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        {file.contentType} File
                                    </Typography>
                                    <Link href={file.fileLink} download>
                                        Download {file.contentType} File
                                    </Link>
                                    <p className='mr-1 p-1 text-grey-200 text-xs flex justify-end'> {new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            ))}

        </Grid>
    );
};

export default SharedFiles;
