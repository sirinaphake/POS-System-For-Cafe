import { Box, Typography } from "@mui/material";
import AxiosInstance from "./AxiosInstance";
import MyTextField from "./forms/MyTextField";
import MyPassField from "./forms/MyPassField";
import MyButton from "./forms/MyButton";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import "@fontsource/pacifico";

const Login = () => {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm();
  const [ShowMessage, setShowMessage] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("Token")); // Get stored token if any

  const submission = (data) => {
    AxiosInstance.post(`/login/`, {
      username: data.username,
      password: data.password,
    })
      .then((response) => {
        console.log(response);
        localStorage.setItem("Token", response.data.token); 
        setToken(response.data.token);
        navigate(`/home`);
      })
      .catch((error) => {
        setShowMessage(true);
        console.error("Error during login", error);
      });
  };

  useEffect(() => {
    if (token) {
      console.log("Stored Token:", token); // Log the token if available
    }
  }, [token]);

  return (
    <div className={"bb"}>
      <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box
            sx={{
              backgroundImage:
                'url("https://st.depositphotos.com/2235295/2688/i/450/depositphotos_26885089-stock-photo-coffee-cup-with-jute-bag.jpg")',
              backgroundSize: "1250px",
              width: "156vh",
              height: "97.7vh",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </Box>
        <div className={"my"}>
          <Box className={"whitebox"}
            sx={{
              padding: "25px",
              borderRadius: "17px",
              width: "125%",
              border: "1px solid #734622",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.7)",
              backgroundColor: "#F2F2F0",
              margin: "28px",
              position: "relative",
              overflow: "hidden",
              animation: "glow 1.5s infinite alternate",
            }}
          >
            <Box className={"itemkbox"}>
              <Box
                className={"title"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h4" mb={2} sx={{ fontFamily: "Pacifico, cursive", fontSize: "40px", color: "#6a4f4b" }}>
                  Welcome To Coffee
                </Typography>
                <Typography variant="h5" mb={2} sx={{ fontFamily: "Pacifico, cursive", fontSize: "34px", color: "#6a4f4b" }}>
                  Login
                </Typography>
              </Box>
            </Box>
            <form onSubmit={handleSubmit(submission)}>
              <Box className={"itemkbox"}>
                <MyTextField
                 label={"Username"} 
                 name="username" 
                 control={control}
                  />
              </Box>
              <Box className={"itemkbox"}>
                <MyPassField 
                label={"Password"} 
                name="password" 
                control={control} 
                />
              </Box>
              <Box className={"itemkbox"}>
                <MyButton 
                label={"Login"}
                 type="submit" 
                 />
              </Box>
            </form>
            {ShowMessage && (
              <Box sx={{ color: "red", textAlign: "center", marginTop: 2 }}>
                <Typography variant="body1">ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</Typography>
              </Box>
            )}
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default Login;
