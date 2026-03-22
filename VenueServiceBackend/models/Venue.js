const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Venue name is required'],
            trim: true,
            minlength: [3, 'Name must be at least 3 characters'],
            maxlength: [100, 'Name must not exceed 100 characters']
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [1, 'Capacity must be at least 1']
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            minlength: [10, 'Description must be at least 10 characters'],
            maxlength: [500, 'Description must not exceed 500 characters']
        },
        amenities: {
            type: String,
            trim: true
        },
        image_url: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: {
                values: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'],
                message: 'Status must be AVAILABLE, OCCUPIED or MAINTENANCE'
            },
            default: 'AVAILABLE'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Venue', venueSchema);
