import Order from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

export const createOrder = async (req, res) => {
    try {
        console.log(req.body);
        const {
            order_id,
            order_date,
            order_status,
            order_total,
            discount,
            coupon_applied,
            coupon_code,
            order_items,
            customerDetails,
            payment_method,
            payment_status
        } = req.body;

        // Validate required fields
        if (!order_id || !order_total || !order_items || !customerDetails || !payment_method) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Create new order
        const newOrder = new Order({
            order_id,
            order_date: order_date || new Date(),
            order_status: order_status || "pending",
            order_total,
            discount: discount || 0,
            coupon_applied: coupon_applied || "no",
            coupon_code: coupon_code || "",
            order_items,
            customerDetails,
            payment_method,
            payment_status: payment_status || (payment_method === "cod" ? "pending" : "pending"),
        });

        // Save order to database
        const savedOrder = await newOrder.save();

        // Send confirmation email to customer
        const customerEmail = {
            from: `"Book My Flower" <${process.env.ADMIN_EMAIL}>`,
            to: customerDetails.email,
            subject: `Order Confirmation - #${order_id}`,
            text: generateOrderConfirmationEmail(savedOrder, customerDetails)
        };

        // Send notification email to admin
        const adminEmail = {
            from: `"Book My Flower" <${process.env.ADMIN_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Order Received - #${order_id}`,
            text: generateAdminNotificationEmail(savedOrder, customerDetails)
        };

        // Send both emails
        await Promise.all([
            sendEmail(customerEmail),
            sendEmail(adminEmail)
        ]);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: savedOrder,
            orderId: savedOrder.order_id
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        });
    }
};

// Email template generators
function generateOrderConfirmationEmail(order, customer) {
    const itemsHtml = order.order_items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <img src="${process.env.BACKEND_URL}${item.image}" width="60" style="border-radius: 4px;">
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  ${item.name}${item.variantName ? ` (${item.variantName})` : ''}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                ${item.quantity}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                ₹${item.price * item.quantity}
            </td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: 'Adreston', 'Montserrat', Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 20px 0;
                background-color: #fff0dc;
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
                background:#fff;
                padding: 30px 20px;
                text-align: center;
            }
            .content {
                padding: 30px;
                background-color: #ffffff;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .order-total {
                background: #f9f9f9;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            .grand-total {
                font-weight: bold;
                font-size: 1.1em;
                border-top: 1px solid #eee;
                padding-top: 10px;
                margin-top: 10px;
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
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://bookmyflowers.shop/assets/Logo-D2J3S_Qv.png" alt="Book My Flower Logo" style="max-width: 180px;">
                <h1 style="color: white; margin: 10px 0 0; font-size: 28px;">Order Confirmed!</h1>
            </div>
            
            <div class="content">
                <p>Hello ${customer.firstName},</p>
                <p>Thank you for your order! We're preparing your items and will notify you when they're on their way.</p>
                
                <h3 style="margin-top: 25px;">Order #${order.order_id}</h3>
                <p>Order Date: ${new Date(order.order_date).toLocaleDateString()}</p>
                
                <table>
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">Item</th>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">Description</th>
                            <th style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">Qty</th>
                            <th style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                
                <div class="order-total">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>₹${order.order_total + order.discount}</span>
                    </div>
                    ${order.discount > 0 ? `
                    <div class="total-row">
                        <span>Discount (${order.coupon_code}):</span>
                        <span>-₹${order.discount}</span>
                    </div>
                    ` : ''}
                    <div class="total-row grand-total">
                        <span>Total:</span>
                        <span>₹${order.order_total}</span>
                    </div>
                </div>
                
                <h3 style="margin-top: 25px;">Shipping Information</h3>
                <p>${customer.firstName} ${customer.lastName}</p>
                <p>${customer.address}</p>
                <p>${customer.city}, ${customer.state} ${customer.pincode}</p>
                <p>${customer.country}</p>
                <p>Phone: ${customer.phone}</p>
                
                <p style="margin-top: 25px;">Payment Method: ${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                
                <p style="margin-top: 25px;">If you have any questions, please reply to this email.</p>
                
                <p>With petals and smiles,<br>
                <strong>The Book My Flower Team</strong></p>
            </div>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Book My Flower. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

function generateAdminNotificationEmail(order, customer) {
    const itemsHtml = order.order_items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                 ${item.name}${item.variantName ? ` (${item.variantName})` : ''}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                ${item.quantity}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                ₹${item.price * item.quantity}
            </td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 20px 0;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border: 1px solid #e0e0e0;
            }
            .header {
                background: #6c5ce7;
                padding: 20px;
                text-align: center;
                color: white;
            }
            .content {
                padding: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
            }
            .order-details {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h2>New Order Received</h2>
                <p>Order #${order.order_id}</p>
            </div>
            
            <div class="content">
                <p>Hello Admin,</p>
                <p>A new order has been placed on your store. Here are the details:</p>
                
                <div class="order-details">
                    <h3>Customer Information</h3>
                    <p>Name: ${customer.firstName} ${customer.lastName}</p>
                    <p>Email: ${customer.email}</p>
                    <p>Phone: ${customer.phone}</p>
                    
                    <h3 style="margin-top: 15px;">Order Summary</h3>
                    <table>
                        <thead>
                            <tr>
                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Product</th>
                                <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">Qty</th>
                                <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    
                    <p><strong>Subtotal:</strong> ₹${order.order_total + order.discount}</p>
                    ${order.discount > 0 ? `<p><strong>Discount:</strong> -₹${order.discount}</p>` : ''}
                    <p><strong>Total:</strong> ₹${order.order_total}</p>
                    
                    <h3 style="margin-top: 15px;">Shipping Address</h3>
                    <p>${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}</p>
                    <p>${customer.country}</p>
                    
                    <h3 style="margin-top: 15px;">Payment Method</h3>
                    <p>${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                    <p>Status: ${order.payment_status}</p>
                </div>
                
                <p style="margin-top: 20px;">Please process this order as soon as possible.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({ _id: id });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validation
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        // Find and update order
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId },
            { order_status: status },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Send status update email to customer
        const statusUpdateEmail = {
            from: `"Book My Flower" <${process.env.ADMIN_EMAIL}>`,
            to: updatedOrder.customerDetails.email,
            subject: `Your Order #${updatedOrder.order_id} Status Update`,
            text: generateStatusUpdateEmail(updatedOrder)
        };

        await sendEmail(statusUpdateEmail);

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
};

// Email template generator
function generateStatusUpdateEmail(order) {
    const statusMessages = {
        pending: "is being processed",
        processing: "is being prepared for shipment",
        shipped: "has been shipped",
        delivered: "has been delivered",
        cancelled: "has been cancelled"
    };

    const statusIcons = {
        pending: "⏳",
        processing: "🛠️",
        shipped: "🚚",
        delivered: "✅",
        cancelled: "❌"
    };

    const itemsHtml = order.order_items.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">
                <img src="${process.env.BACKEND_URL}${item.image}" width="50" style="border-radius: 4px;">
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">
                ${item.name}${item.variantName ? ` (${item.variantName})` : ''}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">
                ${item.quantity}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
                ₹${item.price * item.quantity}
            </td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #fff;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                background-color: #fff;
                border: 1px solid #f0e6d2;
                border-top: none;
            }
            .status-update {
                font-size: 18px;
                margin-bottom: 20px;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 4px;
                text-align: center;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th {
                text-align: left;
                padding: 8px;
                background-color: #f5f5f5;
                border-bottom: 1px solid #ddd;
            }
            .order-total {
                text-align: right;
                font-weight: bold;
                margin-top: 10px;
            }
            .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="https://bookmyflowers.shop/assets/Logo-D2J3S_Qv.png" alt="Book My Flower Logo" style="max-width: 150px;">
        </div>
        
        <div class="content">
            <h2>Order Status Update</h2>
            <p>Dear ${order.customerDetails.firstName},</p>
            
            <div class="status-update">
                ${statusIcons[order.order_status]} Your order <strong>#${order.order_id}</strong> 
                ${statusMessages[order.order_status]}.
            </div>
            
            <h3>Order Details:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div class="order-total">
                <p>Order Total: ₹${order.order_total}</p>
            </div>
            
            <p>If you have any questions about your order, please reply to this email or contact our customer service.</p>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Book My Flower. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export const getUserOrders = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const orders = await Order.find({ "customerDetails.email": email })
            .sort({ order_date: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            error: error.message
        });
    }
};



// export const getAllOrders = async (req, res) => {
//     try {
//         const { status, page = 1, limit = 10 } = req.query;
        
//         const query = {};
//         if (status) {
//             query.order_status = status;
//         }

//         const options = {
//             page: parseInt(page),
//             limit: parseInt(limit),
//             sort: { order_date: -1 }
//         };

//         const orders = await Order.paginate(query, options);

//         res.status(200).json({
//             success: true,
//             ...orders
//         });

//     } catch (error) {
//         console.error("Error fetching all orders:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch orders",
//             error: error.message
//         });
//     }
// };


export const getAllOrders = async (req, res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find()
            .sort({ order_date: -1 }) // Sort by newest first
            .lean(); // Convert to plain JavaScript objects

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};




export const stats =  async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      { $match: { payment_status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$order_total' } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;
    
    const pendingOrders = await Order.countDocuments({ order_status: 'pending' });
    const completedOrders = await Order.countDocuments({ order_status: 'delivered' });
    
    // Last 30 days new customers
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomers = await userModel.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    // Conversion rate (this is a simplified example)
    const totalVisitors = 1000; // You would get this from analytics
    const conversionRate = totalOrders > 0 ? 
      Math.round((totalOrders / totalVisitors) * 100) : 0;
    
    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      newCustomers,
      conversionRate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const recentOrders =  async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const orders = await Order.find()
      .sort({ order_date: -1 })
      .limit(limit)
      .populate('customerDetails');
    
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};