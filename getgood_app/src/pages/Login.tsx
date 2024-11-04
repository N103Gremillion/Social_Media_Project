import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "10%",
            paddingTop: "2%"
        }}
        >
            <Box sx={{
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
                variant="h4">Login</Typography>
                <TextField sx={{
                    mt: 2,
                    width: "20vw",
                    backgroundColor: "white",
                    borderRadius: 1
                }}
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
                        helperText = {!passwordError ? '' : passwordErrorType}
                        value={password}
                        onChange={(e) => {
                        setPassword(e.target.value);
                        }}
                    />

                    <Button 
                        fullWidth
                        variant="contained"
                        sx={{mt: 0.5, mb: 2, width: "20vw"}}
                        onClick={handleLogin}
                    >Login
                    </Button>

                    <Divider sx={{
                        paddingLeft: "10%",
                        paddingRight: "10%",
                        alignSelf: "stretch"}}
                    >OR</Divider>

                    <Typography sx={{mt: 2, mb: 5}}>Forgot Password?</Typography>

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
                    <Typography>Don't have an account?
                        <> </>
                    <Link to="SignUp">Sign Up</Link>
                    </Typography>
                </Box>
            </div>
        )
    }
    
    export default Login