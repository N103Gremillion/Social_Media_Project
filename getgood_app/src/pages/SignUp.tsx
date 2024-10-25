import {
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import {useState} from "react";
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

        try {
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

            const signupInfo = await fetch('http://localhost:4000/addUser', {
                method: "POST",
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify({name, email, password})
            })

            const userResults = await signupInfo.json()
            if(userResults.status > 499) {
                throw new Error("Create user error")
            }

            navigate("/Dashboard")

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