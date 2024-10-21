import React from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import {useState} from "react";
import {Link} from "react-router-dom"

const SignUp = () => {
    const [name, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [nameError, setNameError] = useState(" ")
    const [emailError, setEmailError] = useState(" ")
    const [passwordError, setPasswordError] = useState(" ")

    const handleSignUp = async () => {
        setNameError(name)
        setEmailError(email)
        setPasswordError(password)

        console.log(nameError)
        console.log(emailError)
        console.log(passwordError)

        try {
            console.log("Run existing user")
            const existingUsers = await fetch ('http://localhost:3231/existingUsers', {
                method: 'POST',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify({email})
            })

            const existingResult = await existingUsers.json()
            console.log('Response from server:', existingResult)
            console.log(existingUsers.status)
            if(existingUsers.status > 499) {
                throw new Error("User already exists")
            }

            console.log("Creating user")
            const signupInfo = await fetch('http://localhost:3231/addUser', {
                method: "POST",
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify({name, email, password})
            })

            const signupResult = await signupInfo.json()
            console.log('Response from server:', signupResult)
        } catch (error) {
            console.error('Error: ', error)
        }
    }

    return (
        <div
        style={{
            height: "100vh",  
            width: "100vw",   
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "10%"
        }}
        >
            <Box
                sx={{
                    mt: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="h5">Sign Up</Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    error = {React.useMemo(() => nameError === "", [nameError])}
                    value={name}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    error = {React.useMemo(() => emailError === "", [emailError])}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    error = {React.useMemo(() => passwordError === "", [passwordError])}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSignUp}
                >Sign Up
                </Button>

                <Link to="/">Login</Link>
            </Box>
        </div>
    )
}

export default SignUp