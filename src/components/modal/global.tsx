import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@Store/index';
import { closeModal } from '@Store/slice/modal';
import { Box, Typography, IconButton } from '@mui/material';
import { FaXmark } from 'react-icons/fa6';

const GlobalModal = () => {
    const dispatch = useDispatch();
    const { isOpen, type, props } = useSelector((state: RootState) => state.modal);

    if (!isOpen) return null;

    const handleClose = () => {
        dispatch(closeModal());
    };

    const renderContent = () => {
        switch (type) {
            case 'TWINKLE_INFO':
            case 'SPACE_INFO':
                return (
                    <Box sx={{ p: { xs: 3, md: 5 } }}>
                        <Typography variant="h4" sx={{
                            fontSize: { xs: '1.5rem', md: '1.875rem' },
                            fontWeight: 700,
                            mb: 3,
                            color: 'var(--ink)',
                            background: 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {props.title as string}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {(props.content as string[]).map((text, i) => (
                                <Typography key={i} sx={{
                                    color: 'var(--ink-soft)',
                                    lineHeight: 1.7,
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    wordBreak: 'keep-all'
                                }}>
                                    {text}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box 
            className="pm-backdrop" 
            onClick={handleClose}
            sx={{ position: 'fixed', inset: 0, zIndex: 2000 }}
        >
            <Box 
                className="pm-dialog" 
                onClick={(e) => e.stopPropagation()}
                sx={{ 
                    width: 'min(640px, 100%)',
                    maxHeight: 'min(720px, 90vh)',
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '24px',
                    position: 'relative'
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        color: 'var(--muted)',
                        transition: 'all 0.2s',
                        '&:hover': {
                            color: 'var(--ink)',
                            background: 'rgba(255,255,255,0.05)'
                        }
                    }}
                >
                    <FaXmark size={20} />
                </IconButton>
                {renderContent()}
            </Box>
        </Box>
    );
};

export default GlobalModal;
