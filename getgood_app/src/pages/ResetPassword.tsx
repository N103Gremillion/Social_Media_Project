import {
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router-dom"

const Reset = () => {

    const navigate = useNavigate()

    const id = sessionStorage.getItem('userEmail')

    const [passwordValue, setNewPassword] = useState("")
    const [secondPassword, setSecondPassword] = useState("")
    const [passwordError, setPasswordError] = useState(false)

    const handleReset = async () => {

        const changePassword = await fetch('http://localhost:4000/changeUserPassword', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({id, passwordValue})
        })

        navigate("/")
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
                minWidth: "450px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "black",
                border: "1px solid gray"
            }}
            >
                <Typography sx={{mt: 4, color: "white"}}
                variant="h4">Create A Strong Password</Typography>
                <TextField sx={{
                    mt: 2,
                    width: "20vw",
                    backgroundColor: "#121212",
                    borderRadius: 1
                }}
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="New Password"
                    name="password"
                    type="password"
                    value={passwordValue}
                    onChange={(e) => setNewPassword(e.target.value)}
                    />

                <TextField sx={{
                    mt: 2,
                    width: "20vw",
                    backgroundColor: "#121212",
                    borderRadius: 1
                }}
                    margin="normal"
                    required
                    fullWidth
                    id="password2"
                    label="New Password, again"
                    name="second password"
                    type="password"
                    error = {passwordError}
                    helperText = {secondPassword == passwordValue ? '' : "Passwords do not match"}
                    value={secondPassword}
                    onChange={(e) => setSecondPassword(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        sx={{mt: 0.5, mb: 2, width: "20vw"}}
                        onClick={handleReset}
                    >Reset Password
                    </Button>
                </Box>
            </div>
    )
}

export default Reset