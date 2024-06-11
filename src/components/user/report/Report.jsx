import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Radio, RadioGroup, FormControlLabel, FormControl, TextField, Typography } from '@mui/material';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import { toast,Toaster } from 'sonner';


export default function ReportPostModal({ open, handleClose,postId }) {
  const [reason, setSelectedOption] = useState('');
  const [additionalReason, setReportReason] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleReasonChange = (event) => {
    setReportReason(event.target.value);
  };

  const handleSubmit = async() => {
    // Handle report submission logic here
    console.log('Selected option:', reason);
    console.log('Report reason:', additionalReason);
    try {
        const data = {
            reason,
            additionalReason,
            postId
        }
        const res = await userAxios.post(userApi.reportPost,data)        
        toast.error(res.data.message)
        setSelectedOption('')
        setReportReason('')
        handleClose();
    } catch (error) {
        
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Toaster richColors/>
      <DialogTitle>Report Post</DialogTitle>
      <DialogContent>
        <Typography>Select the reason for reporting this post:</Typography>
        <FormControl component="fieldset">
          <RadioGroup value={reason} onChange={handleOptionChange}>
            <FormControlLabel value="inappropriateContent" control={<Radio />} label="Inappropriate Content" />
            <FormControlLabel value="harassment" control={<Radio />} label="Harassment or Bullying" />
            <FormControlLabel value="spam" control={<Radio />} label="Spam" />
            <FormControlLabel value="misinformation" control={<Radio />} label="Misinformation" />
          </RadioGroup>
        </FormControl>
        <TextField
          label="Additional Reason"
          multiline
          rows={4}
          value={additionalReason}
          onChange={handleReasonChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
}
