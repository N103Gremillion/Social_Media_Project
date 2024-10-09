import {
    Box,
    Button,
    Container,
    Typography,
    Avatar,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person"
import { blue } from "@mui/material/colors"
import React from "react";

export interface PromptProps {
    openUser: boolean
    userValue: string
    onClose: (value: string) => void
}

function Prompt(props: PromptProps) {
    const {onClose, userValue, openUser} = props

    const handleClose = () => {
        onClose(userValue)
    }

    const handleClickUser = (value: string) => {
        onClose(value)
    }

    return (
        <Dialog onClose={handleClose} open={openUser}>
            <DialogTitle>Choose User</DialogTitle>
            <List>
                {username.map((username) => (
                    <ListItem key={username}>
                        <ListItemButton onClick={() => handleClickUser(username)}>
                            <ListItemText primary={username} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    )
}
const username = ['User1', 'User2']

const AccountManagement = () => {
    const [openUser, setOpenUser] = React.useState(false)

    const [userValue, setUserValue] = React.useState(username[0])

    const handleClickUser = () => {
        setOpenUser(true)
    }

    const CloseUser = (value: string) => {
        setOpenUser(false)
        setUserValue(value)
    }

    return (
        <>
            <Container maxWidth="lg">
                <Box sx={{
                    mt: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
                >
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600], width: 100, height: 100}}>
                        <PersonIcon sx={{width: 50, height: 50}}/>
                    </Avatar>
                    <Box sx={{
                        mt: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                    >
                        <Typography variant="h5">User: {userValue}</Typography>
                        
                        <Button
                            variant="contained" onClick={handleClickUser}
                            sx={{ mt: 2}}
                        >Change Username</Button>
                        <Prompt
                            userValue={userValue}
                            openUser={openUser}
                            onClose={CloseUser}
                        />
                    
                        <Button
                            variant="contained"
                            sx={{mt: 2}}
                        >Change Password</Button>
                        
                        <Button
                            variant="contained"
                            sx={{ mt: 2}}
                        >Change Avatar</Button>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default AccountManagement