import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { register, allUser, login, loginOrRegister, forgotPassword, removeUser, resetPassword, validateToken, adminLogin, verifyToken} from '../controllers/userControllers.js';

const authrouter = express.Router();

authrouter.post('/register', register );
authrouter.post('/login', login);
authrouter.post('/login-register', loginOrRegister);
authrouter.post('/alluser', allUser);
authrouter.post('/admin-login', adminLogin);
authrouter.get('/verify-token', verifyToken);
authrouter.post('/forgotpassword', forgotPassword);
authrouter.post('/resetpassword', resetPassword);
authrouter.get('/removeuser/:id', removeUser);
authrouter.get('/validate', authMiddleware, validateToken);

export default authrouter;
