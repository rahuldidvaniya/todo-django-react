import { toast } from 'react-toastify';
import { config } from '../config/config';

let lastToastTime = 0;

const shouldShowToast = () => {
    const now = Date.now();
    if (now - lastToastTime < config.TOAST_CONFIG.throttle) {
        return false;
    }
    lastToastTime = now;
    return true;
};

export const showToast = {
    success: (message) => {
        if (!shouldShowToast()) return;
        toast.success(message, {
            style: { 
                fontSize: '14px',
                fontWeight: '500', 
                closeOnClick: true, 
                pauseOnHover: true, 
                draggable: true,
                autoClose: config.TOAST_DURATION,
            },
            progressStyle: { background: 'rgba(255, 255, 255, 0.7)' },
        });
    },
    error: (message) => {
        if (!shouldShowToast()) return;
        toast.error(message, {
            style: { 
                fontSize: '14px', 
                fontWeight: '500', 
                autoClose: config.TOAST_DURATION, 
                closeOnClick: true, 
                pauseOnHover: true, 
                draggable: true 
            },
            progressStyle: { background: 'rgba(255, 255, 255, 0.7)' },
        });
    },
    warning: (message) => {
        if (!shouldShowToast()) return;
        toast.warning(message, {
            style: { 
                fontSize: '14px', 
                autoClose: config.TOAST_DURATION, 
                closeOnClick: true, 
                pauseOnHover: true, 
                draggable: true, 
                fontWeight: '500' 
            },
            progressStyle: { background: 'rgba(0, 0, 0, 0.2)' },
        });
    },
    info: (message) => {
        if (!shouldShowToast()) return;
        toast.info(message, {
            style: { 
                fontSize: '14px', 
                autoClose: config.TOAST_DURATION, 
                closeOnClick: true, 
                pauseOnHover: true, 
                draggable: true, 
                fontWeight: '500' 
            },
            progressStyle: { background: 'rgba(255, 255, 255, 0.7)' },
        });
    }
};