import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom"

const SignUp = () => {
    
    const navigate = useNavigate()

    //Variables to keep track of information from the user
    const [name, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const [emailErrorType, setErrorType] = useState("")

    const [open, setOpen] = useState(false)
    const [verification, setVerification] = useState(0)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSignUp = async () => {

        const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

        var err = false

        if(name === ""){
            setNameError(true)
            err = true
        } else {
            setNameError(false)
        }
        if(email === "" || emailFormat.test(email) === false){
            setEmailError(true)
            setErrorType("Please enter a valid Email")
            err = true
        } else {
            setEmailError(false)
        }
        if(password === ""){
            setPasswordError(true)
            err = true
        } else {
            setPasswordError(false)
        }

        if(err) {
            return
        }

        var errortype = 0

        try {

            const existingUsers = await fetch ('http://localhost:4000/existingUsers', {
                method: 'POST',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify({email})
            })

            if(existingUsers.status > 499) {
                errortype = 1
                throw new Error("User already exists")
            }

            const verify = Math.floor(Math.random() * 999999) + 100000
            setVerification(verify)

            const subject = `${verify} is your GetGoals code`
            const text = `Hi, Someone tried to sign up for an GetGoals account with ${email}. If it was you, enter this confirmation code in the app: ${verify}`

            const sendEmail = await fetch('http://localhost:4000/sendEmail', {
                method: "POST",
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify({email, subject, text})
            })

            if(sendEmail.status > 499) {
                errortype = 2
                throw new Error("Send email error")
            }

            handleOpen()

        } catch (error) {
            console.error(error)
            setEmailError(true)
            if(errortype == 1) {
                setErrorType("Email is already being used by an existing account")
            }
            else if(errortype == 2) {
                setErrorType("The email verification code could not be sent to your email")
            }
            else {
                setErrorType("An unknown error has occured, retry again later")
            }
        }
    }
    
    const handleAddUser = async () => {
        const signupInfo = await fetch('http://localhost:4000/addUser', {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({name, email, password})
        })
    
        if(signupInfo.status > 499) {
            throw new Error("Create user error")
        }
    
        const signUpResults = await signupInfo.json()
    
        //userID is the key
        sessionStorage.setItem('userID', signUpResults.id)
        navigate("/Dashboard")
    }

    return (
        <div
        style={{
            height: "100vh",
            width: "100vw",  
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "10%",
            paddingTop: "2%",
            backgroundColor: "black"
        }}
        >
            <Box sx={{
                mt: 1,
                minWidth: "350px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "black",
                border: "1px solid gray"
            }}
            >
                <Typography sx={{mt: 4, color: "white"}}
                variant="h4">Sign Up</Typography>
                <TextField sx={{
                    mt: 2,
                    width: "20vw",
                    backgroundColor: "#121212",
                    borderRadius: 1
                }}
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    error = {nameError}
                    helperText = {!nameError ? '' : 'Please enter a Username'}
                    value={name}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField sx={{
                    mt: 0.5,
                    width: "20vw",
                    backgroundColor: "#121212",
                    borderRadius: 1
                }}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    error = {emailError}
                    helperText = {!emailError ? '' : emailErrorType}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField sx={{
                    mt: 0.5,
                    width: "20vw",
                    backgroundColor: "#121212",
                    borderRadius: 1
                }}
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    error = {passwordError}
                    helperText = {!passwordError ? '' : 'Please enter a Password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 0.5, mb: 2, width: "20vw" }}
                    onClick={handleSignUp}
                >Sign Up
                </Button>

            </Box>
            <Box sx={{
                mt: 2,
                minHeight: "75px",
                minWidth: "350px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                border: "2px solid gray"
            }}>
                <Typography sx={{color: "white"}}>Have an account?
                    <> </>
                    <Link to="/">Login</Link>
                </Typography>
                </Box>
                <Dialog
                    sx={{backgroundColor: "black"}}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault()
                            const formData = new FormData(event.currentTarget)
                            const formJson = Object.fromEntries((formData as any).entries())
                            const verify = formJson.verify
                            if(verify == verification) {
                                handleAddUser()
                            }
                            else {
                                alert("That code is not valid")
                            }
                            handleClose()
                        }
                    }}
                    >
                        <DialogTitle>Verify</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                An email has been sent with a verification code. Please submit it to verify your email.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="verify"
                                name="verify"
                                label="Verification"
                                fullWidth
                                variant="standard"
                                />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">Confirm</Button>
                        </DialogActions>
                    </Dialog>

        </div>
    )
}

export default SignUp