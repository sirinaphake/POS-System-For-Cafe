import React, { useEffect, useState } from 'react';
import AxiosInstance from './AxiosInstance';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Typography, Container, Box, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert, Pagination, Divider
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box as ThreeBox, Sphere, Sky, Environment, Lightformer } from '@react-three/drei';

const categories = [
  { value: 'coffee', label: 'กาแฟ' },
  { value: 'chocolate', label: 'ช็อคโกแลต' },
  { value: 'cocoa', label: 'โกโก้' },
  { value: 'tea', label: 'ชา' },
  { value: 'milk', label: 'นม' },
  { value: 'bakery', label: 'ขนม' },
];

const getCategoryLabel = (value) => {
  const category = categories.find(cat => cat.value === value);
  return category ? category.label : value;
};

const RotatingBox = () => {
  const myMesh = React.useRef();
  useFrame(({ clock }) => {
    myMesh.current.rotation.x = clock.getElapsedTime();
    myMesh.current.rotation.y = clock.getElapsedTime();
  });
  return (
    <ThreeBox ref={myMesh}>
      <meshStandardMaterial color={'#6d4c41'} />
    </ThreeBox>
  );
};

const BackgroundScene = () => {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <RotatingBox />
      <OrbitControls />
      <Sky sunPosition={[100, 10, 100]} />
      <Environment preset="city" />
      <Lightformer intensity={2} position={[0, 5, 0]} />
    </Canvas>
  );
};

const ManageMenu = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    AxiosInstance.get('/products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
      });
  };

  const handleDialogOpen = (product = null) => {
    setCurrentProduct(product || { id: '', name: '', category: '', price: '', image: '', stock: '' });
    setIsEditMode(!!product);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (!currentProduct.name || !currentProduct.category || !currentProduct.price || !currentProduct.stock) {
      setError('โปรดกรอกข้อมูลในช่องที่จําเป็นทั้งหมด');
      return;
    }

    const apiCall = isEditMode
      ? AxiosInstance.put(`/products/${currentProduct.id}/`, currentProduct)
      : AxiosInstance.post('/products/', currentProduct);

    apiCall
      .then(() => {
        fetchProducts();
        handleDialogClose();
        setSuccessMessage(`Product ${isEditMode ? 'อัปเดต' : 'added'} successfully!`);
      })
      .catch(error => {
        console.error('Error saving product:', error);
        setError(`Failed to ${isEditMode ? 'update' : 'add'} product. Please try again later.`);
      });
  };

  const handleDelete = (id) => {
    AxiosInstance.delete(`/products/${id}/`)
      .then(() => {
        fetchProducts();
        setSuccessMessage('ลบสินค้าเรียบร้อยแล้ว!');
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        setError('Failed to delete product. Please try again later.');
      });
  };

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => setSuccessMessage(null);

  return (
    <Box sx={{
      width: '100%',
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: '10px',
      maxWidth: '1200px',
      margin: '5px 30px 190px 252px',
      borderRadius: '10px',
    }}>
      <BackgroundScene />
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{
          marginTop: 1,
          fontWeight: 'bold',
          color: '#3e2723',
          fontFamily: 'cursive',
          fontSize: '3rem',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        }}>
          Manage Menu
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Button
          variant="contained"
          component={motion.button}
          whileHover={{ scale: 1.05, rotate: [0, 10, -10, 0] }}
          whileTap={{ scale: 0.95 }}
          sx={{
            backgroundColor: '#6d4c41',
            color: '#fff',
            marginBottom: 1,
            padding: '5px 10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#8d6e63' },
          }}
          onClick={() => handleDialogOpen()}
        >
          Add Product
        </Button>

        <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: '16px', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#6d4c41', fontWeight: 'bold' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Image</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Stock</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentProducts.map((product, index) => (
                <TableRow
                  key={product.id}
                  component={motion.tr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}
                >
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <img
                      src={product.image || 'https://via.placeholder.com/150'}
                      alt={product.name}
                      style={{ width: '69px', height: '50px', borderRadius: '8px', objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </TableCell>
                  <TableCell>{getCategoryLabel(product.category)}</TableCell>
                  <TableCell>{product.price} บาท</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleDialogOpen(product)}
                      sx={{ color: '#6d4c41' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(product.id)}
                      sx={{ color: '#d32f2f' }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {products.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              sx={{
                '& .MuiPaginationItem-root': { color: '#6d4c41', fontWeight: 'bold' },
                '& .Mui-selected': { backgroundColor: '#qq', color: '#3e2723', fontWeight: 'bold' },
              }}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />
          </Box>
        )}

        <AnimatePresence>
          {openDialog && (
            <Dialog
              open={openDialog}
              onClose={handleDialogClose}
              component={motion.div}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <DialogTitle sx={{ backgroundColor: '#6d4c41', color: '#fff' }}>
                {isEditMode ? 'Edit Product' : 'Add Product'}
              </DialogTitle>
              <DialogContent sx={{ padding: 2, backgroundColor: '#f4f1ea', borderRadius: '16px' }}>
                <TextField
                  name="name"
                  label="Name"
                  value={currentProduct?.name || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={currentProduct?.category || ''}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    {categories.map(category => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  value={currentProduct?.price || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  name="stock"
                  label="Stock"
                  type="number"
                  value={currentProduct?.stock || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  name="image"
                  label="Image URL"
                  value={currentProduct?.image || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions sx={{ backgroundColor: '#f4f1ea', padding: 1 }}>
                <Button onClick={handleDialogClose} sx={{ color: '#6d4c41', '&:hover': { color: '#8d6e63' } }}>Cancel</Button>
                <Button onClick={handleSave} sx={{ backgroundColor: '#6d4c41', color: '#fff', '&:hover': { backgroundColor: '#8d6e63' } }}>
                  {isEditMode ? 'Update' : 'Save'}
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </AnimatePresence>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Alert onClose={handleCloseError} severity="error">{error}</Alert>
        </Snackbar>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={handleCloseSuccess}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Alert onClose={handleCloseSuccess} severity="success">{successMessage}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ManageMenu;