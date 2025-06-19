import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const jwt_secret = process.env.ACCESS_TOKEN_SECRET;

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get token from Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {// Check if the Authorization header is present and starts with 'Bearer '
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];// Extract the token from the header

    // 2. Verify access token
    const decoded = jwt.verify(token, jwt_secret!) as { id: string };

    // 3. Attach user ID to request
    req.user = { id: decoded.id };

    // 4. Proceed
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};
