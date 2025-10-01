import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import sendEmail from '../utils/sendEmail.js';


export const register = async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;

        // Validation
        if (!name || !mobile || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (!validator.isMobilePhone(mobile, 'any')) {
            return res.status(400).json({ message: "Invalid mobile number" });
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol"
            });
        }

        // Check if user exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ 
            name, 
            mobile, 
            email, 
            password: hashedPassword 
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '7d'
        });

        // Remove password from user object
        const { password: userPassword, ...userWithoutPassword } = user._doc || user;

        // Send welcome email
        const welcomeEmail = {
            from: `"Book My Flower" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Welcome to Book My Flower! 🎉`,
            text: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Book My Flower</title>
    <style type="text/css">
        /* Base styles with Adreston font */
        @font-face {
            font-family: 'Adreston';
            src: url('https://yourdomain.com/fonts/Adreston-Regular.woff2') format('woff2'),
                 url('https://yourdomain.com/fonts/Adreston-Regular.woff') format('woff');
            font-weight: normal;
            font-style: normal;
        }
        
        body {
            font-family: 'Adreston', 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            // background-color: #fff0dc;
            margin: 0;
            padding: 20px 0;
        }
        
        /* Email container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border: 1px solid #f0e6d2;
        }
        
        /* Header with logo */
        .header {
            background:#decec1;
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        
        .logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 15px;
        }
        
        .header h1 {
            color: white;
            margin: 10px 0 0;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 0.5px;
            font-family: 'Adreston', 'Montserrat', Arial, sans-serif;
        }
        
        /* Content area */
        .content {
            padding: 30px;
            background-color: #ffffff;
            font-family: 'Adreston', 'Montserrat', Arial, sans-serif;
        }
        
        .welcome-text {
            font-size: 18px;
            margin-bottom: 20px;
            color: #444444;
        }
        
        .details-box {
            background-color: #fff9f0;
            border-left: 4px solid #4a6baf;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
        }
        
        .details-list {
            margin: 0;
            padding-left: 20px;
        }
        
        .details-list li {
            margin-bottom: 8px;
        }
        
        /* Button */
        .action-button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #4a6baf 0%, #6a5acd 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 30px;
            margin: 25px 0;
            font-weight: 600;
            text-align: center;
            box-shadow: 0 4px 15px rgba(74, 107, 175, 0.3);
            font-family: 'Adreston', 'Montserrat', Arial, sans-serif;
        }
        
        /* Footer */
        .footer {
            padding: 20px;
            text-align: center;
            background-color: #fff9f0;
            color: #777777;
            font-size: 12px;
            border-top: 1px solid #f0e6d2;
            font-family: 'Adreston', 'Montserrat', Arial, sans-serif;
        }
        
        .social-icons {
            margin: 15px 0;
        }
        
        .social-icon {
            display: inline-block;
            margin: 0 10px;
            color: #6a5acd;
            text-decoration: none;
        }
    </style>
</head>
<body style="background-color: #fff0dc; margin: 0; padding: 20px 0; font-family: 'Adreston', 'Montserrat', Arial, sans-serif;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #f0e6d2;">
        <!-- Header with Logo -->
        <div class="header" style="background-color: #decec1; padding: 30px 20px; text-align: center; position: relative;">
            <img src="https://bookmyflowers.shop/assets/Logo-D2J3S_Qv.png" alt="Book My Flower Logo" class="logo" style="max-width: 180px; height: auto; margin-bottom: 15px;">
            <h1 style="color: white; margin: 10px 0 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px; font-family: 'Adreston', 'Montserrat', Arial, sans-serif;">Welcome to Book My Flower!</h1>
        </div>
        
        <!-- Main Content -->
        <div class="content" style="padding: 30px; background-color: #ffffff; font-family: 'Adreston', 'Montserrat', Arial, sans-serif;">
            <p class="welcome-text" style="font-size: 18px; margin-bottom: 20px; color: #444444;">Hello ${name},</p>
            <p style="margin-bottom: 15px;">Thank you for registering with us! We're thrilled to welcome you to our blossoming community of flower lovers.</p>
            
            <div class="details-box" style="background-color: #fff9f0; border-left: 4px solid #4a6baf; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                <p style="margin-top: 0;">Your account details:</p>
                <ul class="details-list" style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>Name:</strong> ${name}</li>
                    <li style="margin-bottom: 8px;"><strong>Email:</strong> ${email}</li>
                    <li style="margin-bottom: 8px;"><strong>Mobile:</strong> ${mobile}</li>
                </ul>
            </div>
            
            <p style="margin-bottom: 25px;">Discover our fresh floral arrangements and surprise your loved ones today!</p>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/shop" class="action-button" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4a6baf 0%, #6a5acd 100%); color: white !important; text-decoration: none; border-radius: 30px; margin: 25px 0; font-weight: 600; text-align: center; box-shadow: 0 4px 15px rgba(74, 107, 175, 0.3); font-family: 'Adreston', 'Montserrat', Arial, sans-serif;">Start Shopping</a>
            </div>
            
            <p style="margin-bottom: 0;">Need help? Our floral experts are available 24/7 to assist you.</p>
            
            <p style="margin-bottom: 0;">With petals and smiles,<br>
            <strong>The Book My Flower Team</strong></p>
        </div>
        
        <!-- Footer -->
        <div class="footer" style="padding: 20px; text-align: center; background-color: #fff9f0; color: #777777; font-size: 12px; border-top: 1px solid #f0e6d2; font-family: 'Adreston', 'Montserrat', Arial, sans-serif;">
            <div class="social-icons" style="margin: 15px 0;">
                <a href="#" class="social-icon" style="display: inline-block; margin: 0 10px; color: #6a5acd; text-decoration: none;">Facebook</a> | 
                <a href="#" class="social-icon" style="display: inline-block; margin: 0 10px; color: #6a5acd; text-decoration: none;">Instagram</a> | 
                <a href="#" class="social-icon" style="display: inline-block; margin: 0 10px; color: #6a5acd; text-decoration: none;">Twitter</a>
            </div>
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} Book My Flower. All rights reserved.</p>
            <p style="margin: 5px 0;">123 Flower Street, Garden City, GC 12345</p>
            <p style="margin: 5px 0;">
                <a href="mailto:support@bookmyflower.com" style="color: #6a5acd;">Contact Us</a> | 
                <a href="${process.env.FRONTEND_URL}/privacy" style="color: #6a5acd;">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>`
        };

        await sendEmail(welcomeEmail);

        res.status(200).json({ 
            success: true,
            message: "User created successfully", 
            user: userWithoutPassword, 
            token 
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            success: false,
            message: "Registration failed. Please try again later."
        });
    }
};

export const allUser = async (req, res) => {
    try {
        const users = await userModel.find().select("-password");
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password: userPassword } = req.body;

        if (!email || !userPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isValidPassword = await bcrypt.compare(userPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY,
            { expiresIn: '7d' });
        const { password, ...userWithoutPassword } = user._doc || user;
        res.status(200).json({ message: "Logged in successfully", user: userWithoutPassword, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '15m' });
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const mailOptions = {
            from: `"Book My Flowers" <${process.env.EMAIL}>`,
            to: email,
            subject: "Password Reset Request",
            text: await generatePasswordResetEmail(user.name, resetPasswordUrl)
        };

        await sendEmail(mailOptions);
        res.status(200).json({ 
            success : true,
            message: "Rest Link has been sent to your email" ,
        });
    }
    catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({ 
            message: "Something went wrong. Please try again later." 
        });
    }
}

// Email template generator function
const generatePasswordResetEmail = (userName, resetLink) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .email-container {
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #2c3e50;
                padding: 20px;
                text-align: center;
            }
            .logo {
                max-height: 50px;
            }
            .content {
                padding: 30px;
                background-color: #ffffff;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #3498db;
                color: white !important;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #7f8c8d;
                background-color: #f5f5f5;
            }
            .text-center {
                text-align: center;
            }
            .text-muted {
                color: #7f8c8d;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://bookmyflowers.shop/assets/Logo-D2J3S_Qv.png" alt="Your App Logo" class="logo">
            </div>
            
            <div class="content">
                <h2 class="text-center">Password Reset Request</h2>
                <p>Hello ${userName || 'there'},</p>
                
                <p>We received a request to reset your password. Click the button below to set a new password:</p>
                
                <p class="text-center">
                    <a href="${resetLink}" class="button">Reset Password</a>
                </p>
                
                <p>This link will expire in 15 minutes. If you didn't request a password reset, please ignore this email.</p>
                
                <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                <p class="text-muted">${resetLink}</p>
            </div>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Book My Flowers. All rights reserved.</p>
                <p>If you have any questions, contact us at support@yourwebsite.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
};


export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        // Validation
        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ 
                success: false,
                message: "Passwords do not match" 
            });
        }

        if (!validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol"
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        // Find user by ID from the token
        const user = await userModel.findById(decoded.userId);
        
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid or expired token" 
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();
        
        // Send confirmation email
        const confirmationEmail = {
            from: `"Book My Flower" <${process.env.ADMIN_EMAIL}>`,
            to: user.email,
            subject: "Your Password Has Been Changed",
            text: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed</title>
    <style>
        /* Same styling as your registration email */
        body {
            font-family: 'Adreston', 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 20px 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border: 1px solid #f0e6d2;
        }
        .header {
            background:#decec1;
            padding: 30px 20px;
            text-align: center;
        }
        .content {
            padding: 30px;
            background-color: #ffffff;
        }
        .footer {
            padding: 20px;
            text-align: center;
            background-color: #fff9f0;
            color: #777777;
            font-size: 12px;
            border-top: 1px solid #f0e6d2;
        }
    </style>
</head>
<body style="background-color: #fff0dc; margin: 0; padding: 20px 0;">
    <div class="email-container">
        <div class="header">
            <img src="https://bookmyflowers.shop/assets/Logo-D2J3S_Qv.png" alt="Book My Flower Logo" style="max-width: 180px;">
            <h1 style="color: white; margin: 10px 0 0; font-size: 28px;">Password Updated</h1>
        </div>
        
        <div class="content">
            <p>Hello ${user.name},</p>
            <p>Your password has been successfully changed.</p>
            <p>If you did not request this change, please contact our support team immediately.</p>
            <p>With petals and smiles,<br>
            <strong>The Book My Flower Team</strong></p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Book My Flower. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
        };

        await sendEmail(confirmationEmail);

        res.status(200).json({ 
            success: true,
            message: "Password has been reset successfully" 
        });
    } catch (err) {
        console.error('Password reset error:', err);
        
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({ 
                success: false,
                message: "Password reset token has expired" 
            });
        }
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(400).json({ 
                success: false,
                message: "Invalid token" 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: "Something went wrong. Please try again later." 
        });
    }
};



export const removeUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            res.status(400).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });

    }catch (err) {
        res.status(500).json({ message: err.message });
    }
}



// userController.js
export const validateToken = async (req, res) => {
  try {
    // User is already attached to request by authMiddleware
    const user = req.user;
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user._doc || user;
    
    res.status(200).json({ 
      success: true,
      user: userWithoutPassword 
    });
  } catch (err) {
    console.error('Token validation error:', err);
    res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
};


export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
    const ADMIN_EMAIL = process.env.ADMINPENAL_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMINPENAL_PASSWORD;
    const SECRET_KEY = process.env.SECRET_KEY;
    console.log(ADMIN_EMAIL);
    console.log(ADMIN_PASSWORD);
    console.log(SECRET_KEY);
  try {
    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required'
      });
    }

    // 2. Verify admin credentials
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 3. Compare passwords
    // const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!password || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { 
        email: email,
        role: 'admin',
        secret : SECRET_KEY // Replace with actual admin ID from DB
      },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    // // 5. Set cookie (secure in production)
    // res.cookie('adminToken', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 3600000 // 1 hour
    // });

    // 6. Send success response
    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      adminToken: token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};




export const verifyToken = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  try {
    // 1. Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided'
      });
    }

    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 3. Additional verification (optional)
    if (!decoded.email || !decoded.role || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token payload'
      });
    }

    // 4. Token is valid
    res.status(200).json({
      success: true,
      message: 'Token is valid',
    //   user: {
    //     email: decoded.email,
    //     role: decoded.role
    //   }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    // Handle different JWT error types
    let message = 'Invalid token';
    if (error.name === 'TokenExpiredError') {
      message = 'Token has expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Malformed token';
    }

    res.status(403).json({
      success: false,
      message: message
    });
  }
};