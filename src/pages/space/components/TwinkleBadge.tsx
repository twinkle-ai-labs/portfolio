import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '@Store/slice/modal';
import {useLocale} from '@Utils/i18n';
import translations from '@Data/i18n';
import { Box } from '@mui/material';
import { FaMoon } from 'react-icons/fa6';

const TwinkleBadge = () => {
    const dispatch = useDispatch();
    const { language } = useLocale();
    const i18n = translations[language].badge;

    const handleClick = () => {
        dispatch(openModal({
            type: 'TWINKLE_INFO',
            props: {
                title: i18n.modalTitle,
                content: i18n.modalDesc
            }
        }));
    };

    return (
        <Box
            onClick={handleClick}
            sx={{
                position: 'fixed',
                bottom: 24,
                left: 24,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                background: 'rgba(10, 11, 20, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(129, 140, 248, 0.3)',
                borderRadius: '100px',
                cursor: 'pointer',
                color: 'var(--ink)',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                '&:hover': {
                    background: 'rgba(20, 22, 40, 0.85)',
                    borderColor: 'var(--blue)',
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 12px 40px rgba(129, 140, 248, 0.25)',
                    '& .badge-icon': {
                        color: 'var(--blue)',
                        transform: 'rotate(15deg) scale(1.2)',
                    }
                },
                '@media (max-width: 768px)': {
                    bottom: 16,
                    left: 16,
                    px: 1.5,
                    fontSize: 12,
                }
            }}
        >
            <Box
                className="badge-icon"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(129, 140, 248, 0.8)',
                    transition: 'all 0.3s ease',
                }}
            >
                <FaMoon size={14} />
            </Box>
            <span style={{ letterSpacing: '0.02em' }}>{i18n.twinkle}</span>
        </Box>
    );
};

export default TwinkleBadge;
