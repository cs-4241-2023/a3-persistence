const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vslSchema = new Schema({
    year: {
        type: Number,
        required: true,
    },
    car_make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true
    },
    service_type: {
        type: String,
        required: true
    },
    appointment_date: {
        type: String,
        required: true
    },
    dayuntilappointment: {
        type: Number,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
}, { timestamps: true });

const vsl = mongoose.model('vsl', vslSchema);
module.exports = vsl;