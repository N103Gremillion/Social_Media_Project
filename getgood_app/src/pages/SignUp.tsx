import {
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import {useState} from "react";
import {Link} from "react-router-dom"

const SignUp = () => {
    //Variables to keep track of information from the user
    const [name, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const [emailErrorType, setErrorType] = useState("")

    const handleSignUp = async () => {

        if(name === ""){
            setNameError(true)
        }
        else {
            setNameError(false)
        }
        if(email === ""){
            setEmailError(true)
            setErrorType("Please enter an Email")
        }
        else {
            setEmailError(false)
        }
        if(password === ""){
            setPasswordError(true)
        }
        else {
            setPasswordError(false)
        }

        if(nameError || emailError || passwordError) {
            return
        }

        try {
            console.log("Run existing user")
            const existingUsers = await fetch ('http://localhost:4000/existingUsers', {
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
            const signupInfo = await fetch('http://localhost:4000/addUser', {
                method: "POST",
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify({name, email, password})
            })

            const signupResult = await signupInfo.json()
            console.log('Response from server:', signupResult)
        } catch (error) {
            console.error(error)
            setEmailError(true)
            setErrorType("Email is already being used by an existing account")
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
                    error = {nameError}
                    helperText = {!nameError ? '' : 'Please enter a Username'}
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
                    error = {emailError}
                    helperText = {!emailError ? '' : emailErrorType}
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
                    error = {passwordError}
                    helperText = {!passwordError ? '' : 'Please enter a Password'}
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