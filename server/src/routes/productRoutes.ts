import { Router } from 'express';
import * as productController from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/', productController.getAllProducts);

// Admin routes
router.get('/admin', authMiddleware, adminMiddleware, productController.getAdminProducts);
router.get('/admin/movements', authMiddleware, adminMiddleware, productController.getStockMovements);
router.post('/admin', authMiddleware, adminMiddleware, productController.createProduct);
router.post('/admin/upload', authMiddleware, adminMiddleware, upload.single('image'), productController.uploadImage);
router.patch('/admin/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.patch('/admin/:id/stock', authMiddleware, adminMiddleware, productController.updateStock);
router.delete('/admin/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

export default router;
