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
import axios from "axios";

const AccountManagement = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [avatar, setAvatar] = useState<string>("Person2Icon")
    const id = sessionStorage.getItem('userID')

    const [picState, setPicState] = useState('ready')
    const [picFile, setPicFile] = useState<File | null>(null)
    const [picUrl, setPicUrl] = useState<string>("")
    const [profilePicLoading, setProfilePicLoading] = useState<boolean>(false)
    const BASE_URL: string = 'http://localhost:4000/';
    
    const [openUser, setOpenUser] = useState(false)
    const [openPassword, setOpenPassword] = useState(false)
    const [openAvatar, setOpenAvatar] = useState(false)

    var userValue = username
    var passwordValue = password
    var avatarValue = avatar

    const getUsername = async () => {
        try {
            const response = await fetch('http://localhost:4000/getUsername', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            setUsername(data[0].name);
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };
    
    const getPassword = async () => {
        try {
            const response = await fetch('http://localhost:4000/getPassword', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            setPassword(data[0].password);
        } catch (error) {
            console.error('Error fetching password:', error);
        }
    };
    
    const getProfilePic = async () => {
        const uid = sessionStorage.getItem('userID') || "1";
    
        try {
            const response = await axios.get(`${BASE_URL}getProfilePicture`, { params: { uId: uid } });
            const profilePicUrl = response.data.profilePictureUrl;
            // Set avatar as image URL
            setPicUrl(profilePicUrl);
            setAvatar(profilePicUrl);
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUsername();
                await getProfilePic();
                await getPassword();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);   

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
        getPassword()
        setOpenPassword(false)
    }

    const handleClickAvatar = () => {
        setOpenAvatar(true)
    }
    
    const handleCloseAvatar = async (e: React.SyntheticEvent) => {   
        setOpenAvatar(false)
    }

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxFileSize = 10 * 1024 * 1024
        if(e.target.files) {
            const pic = e.target.files[0]
            if(pic.size > maxFileSize) {
                alert("File size excedes 10MB please choose a different file.")
                e.target.value = ""
                return
            }
            else {
                setPicFile(pic)
                setPicUrl(URL.createObjectURL(pic))
            }   
        }      
    }

    const handleProfilePicSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        setOpenAvatar(false)
        e.preventDefault()

        // set on frontend
        if (picUrl) {
            setAvatar(picUrl);
        }
    
        const formData = new FormData();
        formData.append('id', (sessionStorage.getItem('userID') || "1"));
        formData.append('type', 'profile');
        if (picFile) {
            formData.append('image', picFile);
            formData.append('imageName', picFile.name)
        }
        
        await axios.post(`${BASE_URL}addProfilePicture`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log('Error submitting the profilePic:', err)
            })
    }
    

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
            paddingBottom: "10%",
            border: "2px solid black"
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
                        // onClose={handleCloseAvatar}
                        PaperProps={{
                        component: 'form',
                            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault()
                                const formData = new FormData(event.currentTarget)
                                const formJson = Object.fromEntries((formData as any).entries())
                                const avatar = formJson.avatar
                                avatarValue = avatar
                                // handleCloseAvatar(event)
                        //         event.preventDefault()
                        //         const formData = new FormData()
                        //         if(id) {
                        //             formData.append('id', id)
                        //         }
                        //         if(picFile) {
                        //             formData.append('Picture', picFile)
                        //         }
                        //         handleCloseAvatar()
                            } 
                                // event.preventDefault()
                                // const formData = new FormData()
                                // if(id) {
                                //     formData.append('id', id)
                                // }
                                // if(picFile) {
                                //     formData.append('Picture', picFile)
                                // }

                                // const results = await fetch('http://localhost:4000/addProfilePicture', {
                                //     method: 'POST',
                                //     body: formData
                                //     })
                                // .then(results => results.json())

                                // console.log(results.status)
                            }
                        }
                    >
                        <DialogTitle>Change Avatar</DialogTitle>
                            <input type = "file" accept="image/*" name = "Picture" onChange={handlePictureChange}/>
                            {/* <List sx={{pt:0, 
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
                            </List> */}
                        <DialogActions>
                            <Button onClick={handleCloseAvatar}>Cancel</Button>
                            <Button type="submit" onClick={handleProfilePicSubmit}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </div>
    )
}

export default AccountManagement