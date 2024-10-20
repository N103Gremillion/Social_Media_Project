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

    const handleSignUp = async () => {
        try {
            const signupInfo = await fetch("/addUser", {
                method: "POST",
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify({name, email, password})
            })
            const result = await signupInfo.json()
            console.log('Response from server:', result)
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