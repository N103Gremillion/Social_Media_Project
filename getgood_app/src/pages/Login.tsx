import {
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom"


const Login = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const [emailErrorType, setEmailErrorType] = useState("")
    const [passwordErrorType, setPasswordErrorType] = useState("")

    const handleLogin = async () => {

        const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

        var err = false

        if(email === "" || emailFormat.test(email) === false){
            setEmailError(true)
            setEmailErrorType("Please enter a valid Email")
            err = true
        } else {
            setEmailError(false)
        }
        if(password === ""){
            setPasswordError(true)
            setPasswordErrorType("Please enter a Password")
            err = true
        } else {
            setPasswordError(false)
        }

        if(err) {
            return
        }

        const checkForUser = await fetch('http://localhost:4000/checkForUser', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({email, password})
        })

        if(checkForUser.status > 499) {
            setEmail("")
            setEmailError(true)
            setEmailErrorType("Account not found")

            setPassword("")
            setPasswordError(true)
            setPasswordErrorType("Account not found")
        } else {
            const checkResults = await checkForUser.json()

            //userID is the key
            sessionStorage.setItem('userID', checkResults[0].id)
            console.log(`user ID in login: ${sessionStorage.getItem('userID')}`)
            navigate("/Dashboard")
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
            <Box sx={{
                mt: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
            >
                <Typography variant="h5">Login</Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
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
                        helperText = {!passwordError ? '' : passwordErrorType}
                        value={password}
                        onChange={(e) => {
                        setPassword(e.target.value);
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleLogin}
                    >Login
                    </Button>

                    <Link to="SignUp">Sign Up</Link>
                </Box>
            </div>
        )
    }
    
    export default Login