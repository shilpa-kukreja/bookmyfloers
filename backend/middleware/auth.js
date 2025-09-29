import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        // Check if token exists
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided. Authorization denied.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        // Find user and check if token is still valid
        const user = await userModel.findOne({ 
            _id: decoded.userId,
            // You might want to add additional checks here if you implement token invalidation
        }).select('-password');

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token. User not found.' 
            });
        }

        // Attach user and token to request object
        req.user = user;
        req.token = token;
        
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token.' 
            });
        }
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token has expired. Please log in again.' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Server error during authentication.' 
        });
    }
};

export default authMiddleware;