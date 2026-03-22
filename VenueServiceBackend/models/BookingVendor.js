const mongoose = require('mongoose');

const bookingVendorSchema = new mongoose.Schema(
    {
        bookingId: {
            type: Number,
            required: [true, 'Booking ID is required']
        },
        eventId: {
            type: Number,
            required: [true, 'Event ID is required']
        },
        vendors: [
            {
                vendorId: {
                    type: String,
                    required: true
                },
                vendorName: {
                    type: String,
                    required: true
                },
                serviceType: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('BookingVendor', bookingVendorSchema);