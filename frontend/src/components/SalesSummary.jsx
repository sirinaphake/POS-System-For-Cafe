import React, { useState, useEffect } from "react";
import AxiosInstance from "./AxiosInstance";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, MenuItem, Select, FormControl, InputLabel, Grid, Button, Divider
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SalesSummary = () => {
  const [sales, setSales] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState("day");
  const [isToday, setIsToday] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("/sales/");
        setSales(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    fetchData();
  }, []);

  // ฟังก์ชันคำนวณยอดขาย
  const calculateCurrentDaySales = (sales) => {
    const currentDate = new Date(selectedDate);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    return sales.filter((sale) => {
      const saleDate = new Date(sale.sale_date);
      return (
        saleDate.getFullYear() === currentYear &&
        saleDate.getMonth() === currentMonth &&
        saleDate.getDate() === currentDay
      );
    }).reduce((sum, sale) => sum + parseFloat(sale.total_price || 0), 0);
  };

  const calculateCurrentMonthSales = (sales) => {
    const currentDate = new Date(selectedDate);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return sales.filter((sale) => {
      const saleDate = new Date(sale.sale_date);
      return (
        saleDate.getFullYear() === currentYear &&
        saleDate.getMonth() === currentMonth
      );
    }).reduce((sum, sale) => sum + parseFloat(sale.total_price || 0), 0);
  };

  const calculateCurrentYearSales = (sales) => {
    const currentDate = new Date(selectedDate);
    const currentYear = currentDate.getFullYear();

    return sales.filter((sale) => {
      const saleDate = new Date(sale.sale_date);
      return saleDate.getFullYear() === currentYear;
    }).reduce((sum, sale) => sum + parseFloat(sale.total_price || 0), 0);
  };

  // คำนวณค่าต่างๆ
  const currentDaySales = calculateCurrentDaySales(sales);
  const currentMonthSales = calculateCurrentMonthSales(sales);
  const currentYearSales = calculateCurrentYearSales(sales);
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total_price || 0), 0);

  // ฟังก์ชันกรองข้อมูล
  const filterSalesByPeriod = (sales, period) => {
    const selectedDateObj = new Date(selectedDate);
    return sales.filter((sale) => {
      const saleDate = new Date(sale.sale_date);
      if (period === "day") return saleDate.toDateString() === selectedDateObj.toDateString();
      if (period === "month") return (
        saleDate.getFullYear() === selectedDateObj.getFullYear() &&
        saleDate.getMonth() === selectedDateObj.getMonth()
      );
      if (period === "year") return saleDate.getFullYear() === selectedDateObj.getFullYear();
      return false;
    });
  };

  const filteredSales = filterSalesByPeriod(sales, selectedPeriod);

  // เตรียมข้อมูลสำหรับกราฟแท่ง
  const prepareBarChartData = (sales, period) => {
    if (period === "day") {
      const salesByHour = Array(24).fill(0);
      sales.forEach((sale) => {
        const hour = new Date(sale.sale_date).getHours();
        salesByHour[hour] += parseFloat(sale.total_price || 0);
      });
  
      return {
        labels: Array.from({ length: 24 }, (_, i) => `${i} น.`),
        datasets: [{
          label: "ยอดขายรายชั่วโมง (บาท)",
          data: salesByHour,
          backgroundColor: "rgba(78, 52, 46, 0.8)",
          borderColor: "rgba(78, 52, 46, 1)",
          borderWidth: 2,
          borderRadius: 10,
          hoverBackgroundColor: "rgba(78, 52, 46, 1)",
          hoverBorderColor: "rgba(78, 52, 46, 1)",
        }]
      };
    }
  
    if (period === "month") {
      const salesByMonth = Array(12).fill(0);
  
      sales.forEach((sale) => {
        const saleDate = new Date(sale.sale_date);
        const saleMonth = saleDate.getMonth();
        salesByMonth[saleMonth] += parseFloat(sale.total_price || 0);
      });
  
      const monthNames = Array.from({ length: 12 }, (_, i) =>
        new Date(2023, i).toLocaleDateString("th-TH", { month: "short" })
      );
  
      return {
        labels: monthNames,
        datasets: [{
          label: "ยอดขายรายเดือน (บาท)",
          data: salesByMonth,
          backgroundColor: "rgba(78, 52, 46, 0.8)",
          borderColor: "rgba(78, 52, 46, 1)",
          borderWidth: 2,
          borderRadius: 10,
          hoverBackgroundColor: "rgba(78, 52, 46, 1)",
          hoverBorderColor: "rgba(78, 52, 46, 1)",
        }]
      };
    }
  
    if (period === "year") {
      const years = [...new Set(sales.map(sale => new Date(sale.sale_date).getFullYear()))].sort();
      const salesByYear = Array(years.length).fill(0);
  
      sales.forEach((sale) => {
        const saleYear = new Date(sale.sale_date).getFullYear();
        const yearIndex = years.indexOf(saleYear);
        if (yearIndex !== -1) {
          salesByYear[yearIndex] += parseFloat(sale.total_price || 0);
        }
      });
  
      return {
        labels: years.map(year => `${year}`),
        datasets: [{
          label: "ยอดขายรายปี (บาท)",
          data: salesByYear,
          backgroundColor: "rgba(78, 52, 46, 0.8)",
          borderColor: "rgba(78, 52, 46, 1)",
          borderWidth: 2,
          borderRadius: 10,
          hoverBackgroundColor: "rgba(78, 52, 46, 1)",
          hoverBorderColor: "rgba(78, 52, 46, 1)",
        }]
      };
    }
  
    return {
      labels: [],
      datasets: []
    };
  };

  // เตรียมข้อมูลสำหรับกราฟแท่ง
  const barChartData = prepareBarChartData(filteredSales, selectedPeriod);

  // เตรียมข้อมูลสำหรับกราฟวงกลม
  const productSales = filteredSales.reduce((acc, sale) => {
    const productName = sale.product?.name || "สินค้าไม่ระบุชื่อ";
    acc[productName] = (acc[productName] || 0) + parseFloat(sale.total_price || 0);
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(productSales),
    datasets: [{
      label: "ยอดขายตามสินค้า (บาท)",
      data: Object.values(productSales),
      backgroundColor: [
        "rgba(255, 111, 97, 0.8)",
        "rgba(255, 209, 102, 0.8)",
        "rgba(6, 214, 160, 0.8)",
        "rgba(17, 138, 178, 0.8)",
        "rgba(7, 59, 76, 0.8)",
        "rgba(78, 52, 46, 0.8)"
      ],
      borderColor: "#ffffff",
      borderWidth: 2,
      hoverBackgroundColor: [
        "rgba(255, 111, 97, 1)",
        "rgba(255, 209, 102, 1)",
        "rgba(6, 214, 160, 1)",
        "rgba(17, 138, 178, 1)",
        "rgba(7, 59, 76, 1)",
        "rgba(78, 52, 46, 1)"
      ],
      hoverBorderColor: "#ffffff"
    }]
  };

  // ตัวเลือกการแสดงผลกราฟ
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 16,
            weight: "bold"
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            ` ${context.dataset.label}: ${context.parsed.toLocaleString()}฿`
        },
        bodyFont: {
          size: 16,
          weight: "bold"
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: selectedPeriod === "day" ? "เวลา (นาฬิกา)" : selectedPeriod === "month" ? "เดือน" : "ปี",
          color: "#4E342E",
          font: {
            size: 16,
            weight: "bold"
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "ยอดขาย (บาท)",
          color: "#4E342E",
          font: {
            size: 16,
            weight: "bold"
          }
        },
        ticks: {
          callback: (value) => `${value.toLocaleString()}฿`,
          font: {
            size: 16
          }
        },
        grid: {
          color: "#e0e0e0"
        }
      }
    }
  };

  // ฟังก์ชันสำหรับสลับไปดูวันปัจจุบัน
  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setIsToday(true);
  };

  // ฟังก์ชันสำหรับเลือกเดือน
  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value; // ค่าเดือนที่เลือก (รูปแบบ YYYY-MM)
    setSelectedDate(selectedMonth);
    setSelectedPeriod("month");
  };

  return (
    <Box sx={{
      width: '100%',
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: '22px',
      maxWidth: '1210px',
      margin: '2px 260px 300px 260px',
      borderRadius: '10px',
    }}>
      <Typography variant="h3" align="center" sx={{
        fontWeight: "bold", 
        textAlign: "center", 
        mb: 3,
        mt: 2,
        justifyContent: 'center',
        color: "#4E342E",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        fontFamily: "Arial, sans-serif",
      }}>
        📊 SalesSummary
      </Typography>
      <Divider sx={{ mb: 2}} />

      {/* ตัวเลือกช่วงเวลา */}
      <Box sx={{
        mb: 2,
        mt: 2,
        maxWidth: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>เลือกช่วงเวลา</InputLabel>
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            label="เลือกช่วงเวลา"
          >
            <MenuItem value="day">รายวัน</MenuItem>
            <MenuItem value="month">รายเดือน</MenuItem>
            <MenuItem value="year">รายปี</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type={selectedPeriod === "month" ? "month" : selectedPeriod === "year" ? "year" : "date"}
          label="เลือกวันที่"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setIsToday(false);
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 250 }}
          variant="outlined"
        />
        <Button
          variant="contained"
          onClick={handleTodayClick}
          sx={{ ml: 2, bgcolor: "#4E342E", "&:hover": { bgcolor: "#3E2723" }, color: "white" }}
        >
          ดูวันปัจจุบัน
        </Button>
      </Box>

      {/* แสดงวันที่ที่เลือกในกรอบ */}
      <Paper elevation={0} sx={{
        mt: 1,
        mb: 2,
        p: 2,
        border: "2px solid #4E342E",
        width: "50%",
        borderRadius: 5,
        backgroundColor: "transparent"
      }}>
        <Typography variant="h5" sx={{
          color: "#4E342E",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          {selectedPeriod === "day" && selectedDate &&
            `วันที่เลือก: ${new Date(selectedDate).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}`
          }
          {selectedPeriod === "month" && selectedDate &&
            `เดือนที่เลือก: ${new Date(selectedDate).toLocaleDateString("th-TH", {
              month: "long",
              year: "numeric"
            })}`
          }
          {selectedPeriod === "year" && selectedDate &&
            `ปีที่เลือก: ${new Date(selectedDate).toLocaleDateString("th-TH", {
              year: "numeric"
            })}`
          }
          {isToday && selectedPeriod === "day" && " (วันปัจจุบัน)"}
        </Typography>
      </Paper>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* ยอดขายวันนี้ */}
        <Grid item xs={12} md={3}>
          <Paper elevation={10} sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#6D4C41',
            color: 'white',
            borderRadius: 4,
            textAlign: 'center',
            boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-10px)',
              boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.3)',
            },
            height: '100%'
          }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {isToday ? "ยอดขายวันนี้" : "ยอดขายประจำวัน"}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
              {currentDaySales.toLocaleString()}฿
            </Typography>
          </Paper>
        </Grid>

        {/* ยอดขายเดือนนี้ */}
        <Grid item xs={12} md={3}>
          <Paper elevation={10} sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#6D4C41',
            color: 'white',
            borderRadius: 4,
            textAlign: 'center',
            boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-10px)',
              boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.3)',
            },
            height: '100%'
          }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              ยอดขายเดือนนี้
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
              {currentMonthSales.toLocaleString()}฿
            </Typography>
          </Paper>
        </Grid>

        {/* ยอดขายปีปัจจุบัน */}
        <Grid item xs={12} md={3}>
          <Paper elevation={10} sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#6D4C41',
            color: 'white',
            borderRadius: 4,
            textAlign: 'center',
            boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-10px)',
              boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.3)',
            },
            height: '100%'
          }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              ยอดขายรายปี
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
              {currentYearSales.toLocaleString()}฿
            </Typography>
          </Paper>
        </Grid>
        {/* ยอดเงินรวม */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#6D4C41',
            boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            color: '#f0f0f0',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-10px)',
              boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.3)',
            },
            height: '100%'
          }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              ยอดเงินรวม
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
              {totalSales.toLocaleString()}฿
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      {/* ส่วนแสดงกราฟ */}
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        maxWidth: 1200,
        gap: 4,
        mb: 4
      }}>
        {/* กราฟแท่ง */}
        <Paper elevation={3} sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          bgcolor: "white",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
        }}>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            {selectedPeriod === "day" ? "ยอดขายรายวัน" : selectedPeriod === "month" ? "ยอดขายรายเดือน" : "ยอดขายรายปี (ปีปัจจุบัน)"}
          </Typography>
          <Box sx={{ height: 400, position: "relative" }}>
            <Bar
              data={barChartData}
              options={chartOptions}
            />
          </Box>
        </Paper>

        {/* กราฟวงกลมแสดงสัดส่วนสินค้า */}
        <Paper elevation={3} sx={{
          flex: 1,
          p: 2,
          ml: { xs: 0, md: 4 },
          borderRadius: 2,
          mt: { xs: 4, md: 0 },
          bgcolor: "white",
          mr: { xs: 0, md: 4 },
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
        }}>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            สัดส่วนยอดขายตามสินค้า
          </Typography>
          <Box sx={{ height: 400, position: "relative" }}>
            <Pie
              data={pieChartData}
              options={chartOptions}
            />
          </Box>
        </Paper>
      </Box>

      {/* ตารางแสดงรายละเอียด */}
      <Paper elevation={3} sx={{
        borderRadius: 2,
        
        overflow: "hidden",
        bgcolor: "white",
        width: "85%",
        mt: 2,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
      }}>
        <TableContainer component={Paper} sx={{ mt: 0, width: "100%", borderRadius: 2 , boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", overflow: "hidden"}}>
          <Table>
            <TableHead sx={{ backgroundColor: "#4E342E" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ลำดับ</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>วันที่ขาย</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>เวลา</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>สินค้า</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>จำนวนสินค้า</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>จำนวนเงิน (บาท)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx ={{ color: "black" }}>
              {filteredSales.map((sale, index) => (
                <TableRow key={sale.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{new Date(sale.sale_date).toLocaleDateString("th-TH")}</TableCell>
                  <TableCell>{new Date(sale.sale_date).toLocaleTimeString("th-TH")}</TableCell>
                  <TableCell>{sale.product?.name || "สินค้าไม่ระบุชื่อ"}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>{parseFloat(sale.total_price || 0).toLocaleString()} ฿</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SalesSummary;