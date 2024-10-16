import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
  } from "@mui/material";
import {useState} from "react";
import {Link} from "react-router-dom"


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // alert(username + " " + password)
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
                    id="username"
                    label="Username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                        onChange={(e) => {
                        setPassword(e.target.value);
                        }}
                    />
                    <Link to="Dashboard">
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleLogin}
                        >Login
                        </Button>
                    </Link>
                    <Link to="SignUp">Sign Up</Link>
                </Box>
            </div>
        )
    }
    
    export default Login