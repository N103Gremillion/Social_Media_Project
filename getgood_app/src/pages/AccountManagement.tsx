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
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person"
import Person2Icon from "@mui/icons-material/Person2"
import Person3Icon from "@mui/icons-material/Person3"
import Person4Icon from "@mui/icons-material/Person4"
import { blue } from "@mui/material/colors"
import React, { useState, useEffect } from "react";

const AccountManagement = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [avatar, setAvatar] = useState("Person2Icon")
    const id = sessionStorage.getItem('userID')

    useEffect(() => {
        fetch('http://localhost:4000/getUsername', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({id})
        })
        .then(response => response.json())
        .then(data => setUsername(data[0].name))
    }, [])
    
    const getUsername = async () => {

        const getUsername = await fetch('http://localhost:4000/getUsername', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({id})
        })
        
        const usernameResults = await getUsername.json()
        setUsername(usernameResults[0].name)
    }

    const getPassword = async () => {
        const getPassword = await fetch('http://localhost:4000/getPassword', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({id})
        })

        const passwordResults = await getPassword.json()
        setPassword(passwordResults[0].password)
    }
    
    getUsername()
    getPassword()

    const [openUser, setOpenUser] = useState(false)
    const [openPassword, setOpenPassword] = useState(false)
    const [openAvatar, setOpenAvatar] = useState(false)

    var userValue = username
    var passwordValue = password
    var avatarValue = avatar

    const handleClickUser = () => {
        setOpenUser(true)
    }

    const handleCloseUser = async () => {
        const changeUsername = await fetch('http://localhost:4000/changeUserName', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({id, userValue})
        })
        getUsername()
        setOpenUser(false)
    }

    const handleClickPassword = () => {
        setOpenPassword(true)
    }

    const handleClosePassword = async () => {
        const changePassword = await fetch('http://localhost:4000/changeUserPassword', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({id, passwordValue})
        })
        console.log(changePassword.status)
        getPassword()
        setOpenPassword(false)
    }

    const handleClickAvatar = () => {
        setOpenAvatar(true)
    }

    const handleCloseAvatar = () => {
        setOpenAvatar(false)
    }

    console.log(avatar)
    return (
        <div
            style={{
            backgroundColor: 'white',
            width: '95%',
            height: '100vh',
            // padding: '20px',
            textAlign: 'center',
            // make the items in div vertially align
            display: 'flex',
            alignItems:'center',
            justifyContent: 'space-evenly',
            flexDirection: 'column',
            position: 'fixed',
            marginLeft: '5vw',
            zIndex: '0',
            paddingBottom: "10%"
            }}
            >
            <Box sx={{
                mt: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
            >
                <Avatar 
                src={avatar}
                sx={{ bgcolor: blue[100], color: blue[600], width: 100, height: 100}}
                />

                <Box sx={{
                    mt: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
                >
                    <Typography variant="h5">User: {username}</Typography>
                    
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
                                userValue = username
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
                        variant="contained" onClick={handleClickPassword}
                        sx={{mt: 2}}
                    >Change Password</Button>
                    
                    <Dialog 
                        open={openPassword}
                        onClose={handleClosePassword}
                        PaperProps={{
                            component: 'form',
                            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault()
                                const formData = new FormData(event.currentTarget)
                                const formJson = Object.fromEntries((formData as any).entries())
                                const password = formJson.password
                                passwordValue = password
                                handleClosePassword()
                            }
                        }}
            
                    >
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogContent>
                            <TextField
                                id="password"
                                name="password"
                                label="Password"
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClosePassword}>Cancel</Button>
                            <Button type="submit">Confirm</Button>
                        </DialogActions>
                    </Dialog>
                    
                    <Button
                        variant="contained" onClick={handleClickAvatar}
                        sx={{ mt: 2}}
                    >Change Avatar</Button>
                    
                    <Dialog 
                        open={openAvatar}
                        onClose={handleCloseAvatar}
                    >
                        <DialogTitle>Change Avatar</DialogTitle>
                            <List sx={{pt:0, 
                            mt: 1,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"}}>
                                <ListItemButton onClick={() => {setAvatar("PersonIcon"); handleCloseAvatar()}}>
                                    <Avatar sx={{bgcolor: blue[100], color: blue[600]}}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemButton>
                                <ListItemButton onClick={() => {setAvatar("Person2Icon"); handleCloseAvatar()}}>
                                    <Avatar sx={{bgcolor: blue[100], color: blue[600]}}>
                                        <Person2Icon />
                                    </Avatar>
                                </ListItemButton>
                                <ListItemButton onClick={() => {setAvatar("Person3Icon"); handleCloseAvatar()}}>
                                    <Avatar sx={{bgcolor: blue[100], color: blue[600]}}>
                                        <Person3Icon />
                                    </Avatar>
                                </ListItemButton>
                                <ListItemButton onClick={() => {setAvatar("Person4Icon"); handleCloseAvatar()}}>
                                    <Avatar sx={{bgcolor: blue[100], color: blue[600]}}>
                                        <Person4Icon />
                                    </Avatar>
                                </ListItemButton>
                            </List>
                        <DialogActions>
                            <Button onClick={handleCloseAvatar}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </div>
    )
}

export default AccountManagement