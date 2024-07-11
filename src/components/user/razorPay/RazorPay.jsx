import { Box, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';

const RazorpayPayment = () => {
    const user = useSelector((state) => state.userAuth.userInfo)

    const navigate = useNavigate()
    useEffect(() => {
        const loadScript = (src) => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    resolve(true);
                };
                script.onerror = () => {
                    resolve(false);
                };
                document.body.appendChild(script);
            });
        }

        const loadRazorpay = async () => {
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
            }
        }

        loadRazorpay();
    }, []);

    const savePaymentDetails = async (response) => {
        try {
            console.log(response)
            const paymentData = {
                payment: 'Razorpay',                           
                paymentId: response.razorpay_payment_id,                
                amount: 200
            };
            console.log(paymentData)            
            await userAxios.post(userApi.verifiedTag,paymentData)
        } catch (error) {
            console.error('Error saving payment details:', error);
            alert('Failed to save payment details. Please try again.');
        }
    };

    const handlePayment = () => {
        const options = {
            key: import.meta.env.VITE_USER_RAZOR_KEY_ID,
            amount: 200 * 100,
            currency: 'INR',
            name: 'Verify account',
            description: 'Verify account',
            image: '/verified.jfif',
            notes: {
                address: 'Razorpay Corporate Office'
            },
            theme: {
                color: '#7BD654'
            },
            handler: function (response) {
                alert( `Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                savePaymentDetails(response);
            },
            modal: {
                ondismiss: function () {
                    alert('Payment dismissed');
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
       <Button onClick={handlePayment} variant='text' size='small'>
                Get verified       
       </Button>
    );
};

export default RazorpayPayment;