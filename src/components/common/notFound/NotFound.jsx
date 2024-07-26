import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <Box className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <Box className="mx-auto max-w-md text-center">
                <FrownIcon className="mx-auto h-12 w-12 text-primary" />
                <Typography  variant="h1" className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Oops, page not found!
                </Typography>
                <Typography className="mt-4 text-muted-foreground">
                    The page you're looking for doesn't exist or has been moved. Don't worry, we're here to help you find your way.
                </Typography>
                <Box className="mt-6">
                    {/* <Button
                        component={Link}
                        to={'/home'}
                        variant="contained"
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Go to Homepage
                    </Button> */}

                </Box>
            </Box>
        </Box>
    );
}

function FrownIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
    );
}

function XIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
