const mongoose = require('mongoose');
const Schema = mongoose.Schema

const seatSchema = new Schema({
    seatNumber:{
        type: String,
        required: true
    },
    availability:{
        type: Boolean,
        default: true
    },
    seatType:{
        type: String,
        enum : ["single sleeper","double sleeper", "seater"],
        default: "seater"
    },
    seatPrice:{
        type: Number,
        required: true
    },
    assignedTo:{
        name:{type: String, required: function(){return !this.availability}},
        email:{type: String, required: function(){return !this.availability}},
        phone:{type:Number, required: function(){return !this.availability}}
    }
})

const pickupSchema = new Schema({
    city:{
        type: String,
        required: true,
    },
    landmark:[String]
})

const dropSchema = new Schema({
    city:{
        type: String,
        required: true,
    },
    landmark:[String]
})



const busSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pickup:[pickupSchema],
    drop:[dropSchema],
    bustype:{
        type: String,
        required: true
    },
    isAc:{
        type: Boolean,
        default: false
    },
    rating:{
        type: Number,
        default: 0,
    },
    seats:[seatSchema]
    
})

module.exports = mongoose.model("Bus", busSchema)