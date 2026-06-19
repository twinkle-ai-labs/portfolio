import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@Store/index";
import {Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer} from "@mui/material";
import {closeDrawer, DrawerType, openDrawer} from "@Store/slice/drawer";
import {menus} from "@Data/link";

const SidebarDrawer = () => {
    const dispatch = useDispatch()
    const opened = useSelector((state: RootState) => state.drawer.sidebarOpen)

    const toggleDrawer = () => {
        if (opened) {
            dispatch(closeDrawer(DrawerType.SIDEBAR))
        } else {
            dispatch(openDrawer(DrawerType.SIDEBAR))
        }
    }
    const DrawerList = (
        <Box sx={{width: 300}} role="presentation" onClick={toggleDrawer}>
            <Divider/>
            <List>
                {menus.map((menu, index) => (
                        <ListItem key={'sidebar-'+(index+1).toString()} disablePadding>
                            <ListItemButton onClick={() => {
                            if (menu.link.startsWith('#')) {
                                document.querySelector(menu.link)?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                                return;
                            }
                            window.location.href = menu.link;
                        }}>
                            <ListItemIcon>
                                {menu.icon}
                            </ListItemIcon>
                            <ListItemText primary={menu.name}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
    return (
        <SwipeableDrawer
            anchor={"right"}
            open={opened}
            onClose={toggleDrawer}
            onOpen={toggleDrawer}
        >
            {DrawerList}
        </SwipeableDrawer>
    );
};

export default SidebarDrawer;
