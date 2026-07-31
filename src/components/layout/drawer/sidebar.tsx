import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@Store/index";
import {Box, Drawer, Stack, Typography} from "@mui/material";
import {closeDrawer, DrawerType, openDrawer} from "@Store/slice/drawer";
import {menus, links} from "@Data/link";
import config from "@Data/config";
import useLocale from "@Utils/i18n";

const SidebarDrawer = () => {
    const dispatch = useDispatch()
    const opened = useSelector((state: RootState) => state.drawer.sidebarOpen)
    const {t} = useLocale()

    const toggleDrawer = () => {
        dispatch(opened ? closeDrawer(DrawerType.SIDEBAR) : openDrawer(DrawerType.SIDEBAR))
    }

    const pendingTarget = React.useRef<string | null>(null)

    const handleNavigation = (link: string) => {
        if (link.startsWith('#')) {
            // 스크롤은 Drawer가 닫힌 뒤에 실행한다. 열려 있는 동안은 MUI의 스크롤 락이
            // scrollIntoView를 되돌려 버린다.
            pendingTarget.current = link;
            toggleDrawer();
            return;
        }
        window.location.href = link;
    };

    const handleTransitionExited = () => {
        const target = pendingTarget.current;
        if (!target) return;
        pendingTarget.current = null;
        document.querySelector(target)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    return (
        <Drawer
            anchor="right"
            open={opened}
            onClose={toggleDrawer}
            ModalProps={{closeAfterTransition: true, onTransitionExited: handleTransitionExited}}
            PaperProps={{
                sx: {
                    width: 292,
                    backgroundColor: 'var(--home-bg)',
                    backgroundImage: 'radial-gradient(120% 60% at 100% 0%, rgba(129, 140, 248, 0.14) 0%, transparent 60%)',
                    borderLeft: '1px solid var(--line)',
                    color: 'var(--ink)',
                }
            }}
        >
            <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}} role="presentation">
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{px: 2.5, py: 3}}>
                    <Box sx={{
                        width: 44, height: 44, borderRadius: '14px', flexShrink: 0,
                        background: 'var(--grad-accent)',
                        display: 'grid', placeItems: 'center',
                        fontWeight: 700, fontSize: 15, letterSpacing: '0.02em', color: '#12131c',
                        boxShadow: '0 6px 20px rgba(129, 140, 248, 0.32)',
                    }}>
                        HJ
                    </Box>
                    <Box sx={{minWidth: 0}}>
                        <Typography sx={{fontSize: 16, fontWeight: 600, lineHeight: 1.3}}>
                            {config.profile.name.korean}
                        </Typography>
                        <Typography sx={{fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.4}}>
                            {config.profile.jobs[1]}
                        </Typography>
                    </Box>
                </Stack>

                <Box sx={{height: '1px', background: 'var(--line)', mx: 2.5}}/>

                <Stack component="nav" spacing={0.5} sx={{flex: 1, px: 1.5, py: 2.5}}>
                    {menus.map((menu) => (
                        <Box
                            key={menu.id}
                            component="button"
                            onClick={() => handleNavigation(menu.link)}
                            sx={{
                                display: 'flex', alignItems: 'center', gap: 1.75,
                                width: '100%', px: 1.75, py: 1.375,
                                border: '1px solid transparent', borderRadius: 'var(--radius-sm)',
                                background: 'transparent', cursor: 'pointer',
                                color: 'var(--ink-soft)', font: 'inherit', fontSize: 14.5, fontWeight: 500,
                                textAlign: 'left',
                                transition: 'all var(--transition-fast)',
                                '& svg': {fontSize: 17, color: 'var(--muted)', transition: 'color var(--transition-fast)'},
                                '&:hover': {
                                    background: 'var(--blue-soft)',
                                    borderColor: 'var(--blue-line)',
                                    color: 'var(--ink)',
                                    '& svg': {color: 'var(--blue)'},
                                },
                            }}
                        >
                            {menu.icon}
                            {menu.name}
                        </Box>
                    ))}
                </Stack>

                <Box sx={{height: '1px', background: 'var(--line)', mx: 2.5}}/>

                <Stack direction="row" spacing={1} sx={{px: 2.5, py: 2.5}}>
                    {links.map((link) => (
                        <Box
                            key={link.id}
                            component="a"
                            href={link.link}
                            target={link.id === 'email' ? undefined : '_blank'}
                            rel={link.id === 'email' ? undefined : 'noreferrer'}
                            aria-label={t(link.name)}
                            onClick={toggleDrawer}
                            sx={{
                                flex: 1, height: 42,
                                display: 'grid', placeItems: 'center',
                                border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
                                background: 'var(--surface-soft)',
                                color: 'var(--muted)', fontSize: 17,
                                transition: 'all var(--transition-fast)',
                                '&:hover': {
                                    borderColor: 'var(--blue-line)',
                                    background: 'var(--blue-soft)',
                                    color: 'var(--blue)',
                                },
                            }}
                        >
                            {link.icon}
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Drawer>
    );
};

export default SidebarDrawer;
