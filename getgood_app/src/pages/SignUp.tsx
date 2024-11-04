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

            if(signupInfo.status > 499) {
                throw new Error("Create user error")
            }

            const signUpResults = await signupInfo.json()

            //userID is the key
            sessionStorage.setItem('userID', signUpResults.id)
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "10%",
            paddingTop: "2%"
        }}
        >
            <Box
                sx={{
                    mt: 1,
                minWidth: "350px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "lightgray",
                border: "2px solid gray"
                }}
            >
                <Typography sx={{mt: 5}}
                variant="h4">Sign Up</Typography>
                <TextField sx={{
                    mt: 2,
                    width: "20vw",
                    backgroundColor: "white",
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
                    backgroundColor: "white",
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
                    backgroundColor: "white",
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
                backgroundColor: "lightgray",
                border: "2px solid gray"
            }}>
                <Typography>Have an account?
                    <> </>
                    <Link to="/">Login</Link>
                </Typography>
                </Box>
        </div>
    )
}

export default SignUp