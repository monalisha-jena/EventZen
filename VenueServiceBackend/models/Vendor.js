const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Vendor name is required'],
            trim: true,
            minlength: [3, 'Name must be at least 3 characters'],
            maxlength: [100, 'Name must not exceed 100 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            unique: true,
            match: [
                /^[A-Za-z0-9+_.-]+@(gmail\.com|yahoo\.com|outlook\.com)$/,
                'Email should be valid and end with @gmail.com, @yahoo.com or @outlook.com'
            ]
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            match: [
                /^[6-9][0-9]{9}$/,
                'Phone must be a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9'
            ]
        },
        serviceType: {
            type: String,
            required: [true, 'Service type is required'],
            enum: {
                values: [
                    'CATERING',
                    'AV',
                    'PHOTOGRAPHY',
                    'DECORATION',
                    'SECURITY',
                    'TRANSPORT',
                    'OTHER'
                ],
                message: 'Service type must be CATERING, AV, PHOTOGRAPHY, DECORATION, SECURITY, TRANSPORT or OTHER'
            }
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be a positive number']
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            minlength: [10, 'Description must be at least 10 characters'],
            maxlength: [500, 'Description must not exceed 500 characters']
        },
        status: {
            type: String,
            enum: {
                values: ['AVAILABLE', 'OCCUPIED'],
                message: 'Status must be AVAILABLE or OCCUPIED'
            },
            default: 'AVAILABLE'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Vendor', vendorSchema);