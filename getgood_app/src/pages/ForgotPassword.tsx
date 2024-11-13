import {
    Box,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom"

const Forgot = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false)
    const [emailErrorType, setEmailErrorType] = useState("")
    const [id, setId] = useState("")

    const [open, setOpen] = useState(false)
    const [verification, setVerification] = useState(0)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

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

        var errortype = 0

        try {
            const checkForUser = await fetch('http://localhost:4000/checkForUser', {
                method: 'POST',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify({email, })
            })
    
            if(checkForUser.status > 499) {
                errortype = 1
                throw new Error("Account not found")
            }

            const check = await checkForUser.json()
            setId(check[0].id)

            const verify = Math.floor(Math.random() * 999999) + 100000
            setVerification(verify)

            const subject = `${email}, reset your password for GetGoals`
            const text = `Hi ${email}, someone is trying to reset your password. If it was you, enter this confirmation code in the app: ${verify}`

            const sendEmail = await fetch('http://localhost:4000/sendEmail', {
                method: "POST",
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify({email, subject, text})
            })

            if(sendEmail.status > 499) {
                errortype = 2
                throw new Error("Send email error")
            }

            handleOpen()

        } catch(error) {
            console.error(error)
            setEmail("")
            setEmailError(true)
            if(errortype == 1) {
                setEmailErrorType("Account not found")
            }
            else if(errortype == 2) {
                setEmailErrorType("The email to change your password could not be sent to your email")
            }
            else {
                setEmailErrorType("An unknown error has occured, retry again later")
            }
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
                    backgroundColor: "#121212",
                    input: { color: 'white' },
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

                    <Link to="/signup">Create new account</Link>

                    <Link to="/">
                        <Button sx={{
                            border: "1px solid gray",
                        }}>Back to login</Button>
                    </Link>
                </Box>

                <Dialog
                    sx={{backgroundColor: "black"}}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault()
                            const formData = new FormData(event.currentTarget)
                            const formJson = Object.fromEntries((formData as any).entries())
                            const verify = formJson.verify
                            if(verify == verification) {
                                sessionStorage.setItem('userEmail', id)
                                navigate("/reset-password")
                            }
                            else {
                                alert("That code is not valid")
                            }
                            handleClose()
                        }
                    }}
                    >
                        <DialogTitle>Verify</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                An email has been sent with a verification code. Please submit it to change your password.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="verify"
                                name="verify"
                                label="Verification"
                                fullWidth
                                variant="standard"
                                />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">Confirm</Button>
                        </DialogActions>
                    </Dialog>
            </div>
    )
}

export default Forgot