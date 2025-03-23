import { Box } from "@mui/material"

const MyMessage = ({ text, color }) => {
    return (
        <Box sx={{
            backgroundColor: color,
            color: '#FFFFFF',
            width: '90%',
            minHeight: '40px',  
            padding: '10px',   
            position: 'absolute',
            top: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px' 
        }}>
            {text}
        </Box>
    )
}

export default MyMessage
