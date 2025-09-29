import mongoose, { disconnect } from "mongoose";

const orderSechma = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    order_date: {
        type: Date,
        required: true
    },
    order_status: {
        type: String,
        required: true
    },
    order_total: {
        type: Number,
        required: true
    },
    discount : {
        type: Number,
        required: true
        },
    coupon_applied : {
        type: String,
        required: true
        },
    coupon_code : {
        type: String,
        },
    order_items: Array,
    customerDetails : {
        type : Object,
        required : true
    },
    payment_method : {
        type : String,
        required : true
    },
    payment_status : {
        type : String,
        required : true
    },
    created_at : {
        type : Date,
        default : Date.now
    },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSechma);
export default Order;
