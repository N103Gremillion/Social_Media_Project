import {
    Box,
    Button,
    Container,
    Typography,
    Avatar,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    TextField
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person"
import { blue } from "@mui/material/colors"
import React, { useState } from "react";

const username = 'User1'

const AccountManagement = () => {
    const [openUser, setOpenUser] = useState(false)

    const [userValue, setUserValue] = useState(username)

    const handleClickUser = () => {
        setOpenUser(true)
    }

    const handleCloseUser = () => {
        setOpenUser(false)
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
                        <Dialog 
                            open={openUser}
                            onClose={handleCloseUser}
                            PaperProps={{
                                component: 'form',
                                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                    event.preventDefault()
                                    const formData = new FormData(event.currentTarget)
                                    const formJson = Object.fromEntries((formData as any).entries())
                                    const username = formJson.username
                                    setUserValue(username)
                                    handleCloseUser()
                                }
                            }}
                
                        >
                            <DialogTitle>Change User</DialogTitle>
                            <DialogContent>
                                <TextField
                                    id="name"
                                    name="username"
                                    label="Username"
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseUser}>Cancel</Button>
                                <Button type="submit">Confirm</Button>
                            </DialogActions>
                        </Dialog>
                    
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