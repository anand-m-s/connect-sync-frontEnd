import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

const typingAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const TypingIndicator = () => {
  return (
    <Box display="flex" alignItems="center">
      <Box
        component="span"
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          animation: `${typingAnimation} 1s infinite`,
          margin: '0 2px',
        }}
      />
      <Box
        component="span"
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          animation: `${typingAnimation} 1s infinite 0.2s`,
          margin: '0 2px',
        }}
      />
      <Box
        component="span"
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          animation: `${typingAnimation} 1s infinite 0.4s`,
          margin: '0 2px',
        }}
      />
    </Box>
  );
};

export default TypingIndicator;
