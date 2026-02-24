import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido' });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const role = (req as any).userRole;
  if (role !== 'ADMIN' && role !== 'MANAGER') {
    return res.status(403).json({ message: 'Acceso denegado, se requiere rol administrativo' });
  }
  next();
};
