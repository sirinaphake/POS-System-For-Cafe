import React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import AppBar from "@mui/material/AppBar"
import CssBaseline from "@mui/material/CssBaseline"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Collapse from "@mui/material/Collapse"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import CoffeeIcon from "@mui/icons-material/Coffee"
import HomeIcon from "@mui/icons-material/Home"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import BarChartIcon from "@mui/icons-material/BarChart"
import InventoryIcon from "@mui/icons-material/Inventory"
import GroupIcon from "@mui/icons-material/Group"
import LogoutIcon from "@mui/icons-material/Logout"
import MenuIcon from "@mui/icons-material/Menu"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import Avatar from "@mui/material/Avatar" 
import AxiosInstance from './AxiosInstance'
import { Link, useLocation, useNavigate } from "react-router-dom"

const drawerWidth = 240;

export default function Navbar(props) {
  const { content, username } = props
  const location = useLocation()
  const path = location.pathname
  const navigate = useNavigate()

  const [openSummary, setOpenSummary] = React.useState(false)
  const [openProducts, setOpenProducts] = React.useState(false)
  const [openDrawer, setOpenDrawer] = React.useState(true)
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState("")
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success")

  const logoutUser = () => {
    AxiosInstance.post("api/logout/")
      .then(() => {
        localStorage.removeItem("Token")
        setSnackbarMessage("ล็อกเอาท์สำเร็จ")
        setSnackbarSeverity("success")
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/')
        }, 700)
      })
      .catch((error) => {
        setSnackbarMessage("เกิดข้อผิดพลาดในการล็อกเอาท์")
        setSnackbarSeverity("error")
        setOpenSnackbar(true)
      })
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer)
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(to right, #4E342E, #6D4C41, #8D6E63)",
          boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.5)",
          '& .MuiTypography-body1': {
            color: '#D7CCC8'
          }
        }}
      >
        <Toolbar>
          <MenuIcon 
            sx={{ 
              mr: 2, 
              cursor: "pointer", 
              color: '#D7CCC8',
              '&:hover': { color: 'white' } 
            }} 
            onClick={toggleDrawer} 
          />
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              fontFamily: "Pacifico, cursive",
              color: '#D7CCC8'
            }}
          >
            <CoffeeIcon sx={{ marginRight: 2 }} /> Coffee Admin
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* ส่วนแสดงโปรไฟล์และชื่อผู้ใช้ */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            paddingRight: 2 
          }}>
            <Avatar 
              sx={{ 
                bgcolor: '#D7CCC8', 
                width: 40, 
                height: 40, 
                fontWeight: 'bold',
                color: '#4E342E'
              }}
            >
              {username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {username}
            </Typography>
            <LogoutIcon 
              sx={{ 
                cursor: "pointer", 
                color: '#D7CCC8',
                '&:hover': { color: 'white' } 
              }} 
              onClick={logoutUser} 
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={openDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: "width 0.3s",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(to right, #4E342E, #6D4C41, #8D6E63)",
            color: "#FFFFFF",
            fontSize: "16px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)",
            borderRadius: "0 12px 12px 0",
            overflow: "hidden",
          },
          "& .MuiListItemButton-root": {
            "&.Mui-selected": {
              backgroundColor: "#6D4C41",
              color: "#FFFFFF",
              boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)",
              borderRadius: "12px",
              "& .MuiListItemIcon-root": {
                color: "#FFFFFF",
              },
            },
            "&:hover": {
              backgroundColor: "#8D6E63",
              color: "#FFFFFF",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
            },
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/home"
                selected={"/home" === path}
                sx={{
                  "&:hover": {
                    backgroundColor: "#8D6E69",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#6d4c41",
                    color: "white",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                    borderRadius: "10px",
                  },
                  transition: "all 0.3s ease-in-out",
                  margin: "2px 0",
                }}
              >
                <ListItemIcon>
                  <HomeIcon sx={{ color: "/home" === path ? "white" : "#6d4c41" }} />
                </ListItemIcon>
                <ListItemText primary="หน้าแรก" />
              </ListItemButton>
            </ListItem>

            <ListItemButton onClick={() => setOpenProducts(!openProducts)}>
              <ListItemIcon>
                <MenuBookIcon sx={{ color: "#6d4c41" }} />
              </ListItemIcon>
              <ListItemText primary="สินค้า" />
              {openProducts ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openProducts} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="/ManageMenu"
                  selected={"/ManageMenu" === path}
                  sx={{
                    pl: 14,
                    "&:hover": {
                      backgroundColor: "#8D6E69",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      borderRadius: "10px",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#6d4c41",
                      color: "white",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                      borderRadius: "10px",
                    },
                    transition: "all 0.2s ease-in-out",
                    margin: "2px 0",
                  }}
                >
                  <ListItemText primary="เมนู" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to="/inventory"
                  selected={"/inventory" === path}
                  sx={{
                    pl: 14,
                    "&:hover": {
                      backgroundColor: "#8D6E69",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      borderRadius: "10px",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#6d4c41",
                      color: "white",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                      borderRadius: "10px",
                    },
                    transition: "all 0.3s ease-in-out",
                    margin: "2px 0",
                  }}
                >
                  <ListItemText primary="สินค้า" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/salesSummary"
                selected={"/salesSummary" === path}
                sx={{
                  "&:hover": {
                    backgroundColor: "#8D6E69",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#6d4c41",
                    color: "white",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                    borderRadius: "10px",
                  },
                  transition: "all 0.3s ease-in-out",
                  margin: "2px 0",
                }}
              >
                <ListItemIcon>
                  <BarChartIcon sx={{ color: "/salesSummary" === path ? "white" : "#6d4c41" }} />
                </ListItemIcon>
                <ListItemText primary="สรุปยอดขาย" />
              </ListItemButton>
            </ListItem>

          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <Toolbar />
        {content}
      </Box>
    </Box>
  )
}