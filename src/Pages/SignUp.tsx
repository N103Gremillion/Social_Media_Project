import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from "@mui/material";
import {useState} from "react";
import {Link} from "react-router-dom"

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = () => {
        alert(username + " " + email + " " + password)
    }

    return (
        <>
            <Container maxWidth="xs">
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        name="email"
                        label="Email Address"
                        type= "email"
                        value={email}
                        onChange={(e) => setEmail(e. target.value)}
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
            </Container>
        </>
    )
}

export default SignUp