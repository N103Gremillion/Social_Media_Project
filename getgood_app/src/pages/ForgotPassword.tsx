import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
} from "@mui/material";
import {useState} from "react";
import {Link} from "react-router-dom"

const Forgot = () => {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false)
    const [emailErrorType, setEmailErrorType] = useState("")

    const handleRequest = async () => {
        
        const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

        // var err = false

        if(email === "" || emailFormat.test(email) === false){
            setEmailError(true)
            setEmailErrorType("Please enter a valid Email")
            // err = true
        } else {
            setEmailError(false)
        }

        const checkForUser = await fetch('http://localhost:4000/checkForUser', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({email, })
        })

        if(checkForUser.status > 499) {
            setEmail("")
            setEmailError(true)
            setEmailErrorType("Account not found")
        } else {
            console.log(checkForUser.status)
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
                variant="h4">Trouble logging in?</Typography>
                <TextField sx={{
                    mt: 2,
                    width: "20vw",
                    backgroundColor: "gray",
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

                    <Button
                        variant="contained"
                        sx={{mt: 0.5, mb: 2, width: "20vw"}}
                        onClick={handleRequest}
                    >Send login link
                    </Button>

                    <Divider sx={{
                        paddingLeft: "10%",
                        paddingRight: "10%",
                        alignSelf: "stretch",
                        color: "white",
                        "&::before, &::after": {
                        borderColor: "gray",
                        },
                    }}
                    >OR</Divider>

                    <Link to="/signup">Create new account</Link>

                    <Link to="/">
                        <Button sx={{
                            border: "1px solid gray",
                        }}>Back to login</Button>
                    </Link>

                </Box>
            </div>
    )
}

export default Forgot