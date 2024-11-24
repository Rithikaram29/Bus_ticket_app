//users doesn't have to create anything in the db. They just have to modify the existing data. 
// That is book tickets and cancel tickets.

const Bus = require('../models/adminModel');

// To book tickets
const bookTicket = async (req,res,next)=>{
    const busId = req.params.id; //assuming once we are directed to the bus page, the id is added in the params
    try {
        const currentBus = await Bus.findById(busId);

        if(!currentBus){
            res.status(404).json({error: "bus not found"})
        }

        const selectedSeats = req.body.seats //req.body will contain object with key as seats and value as array of selected seats.
        //structure of the incoming req.body will be {seats:[{seatNo:"", name:"", phone:"", email:""},{seatNo:"", name:"", phone:"", email:""}]}

        //getting the seatnumber to be booked.
        const selectedSeatNumbers = selectedSeats.map((ele)=> ele.seatNo);

        //using the eselected seatnumber to check if that is already booked to avoid error
        const bookedSeats = currentBus.seats.filter((seat)=>
            selectedSeatNumbers.includes(seat.seatNumber) && seat.availability === false
        ); 

       if(bookedSeats > 0){
        res.status(404).json({
            error: "Some seats are already booked",
            seatNum: bookedSeats.map((seat)=> seat.seatNumber)
        })
       }else{
        currentBus.seats.map((seat)=>{
           if (selectedSeatNumbers.includes(seat.seatNumber)){
            seat.availability = false;
            const matchingSeat = selectedSeats.filter((ele)=> ele.seatNumber === seat.seatNumber )
            seat.assignedTo={
                name:matchingSeat.name,
                email:matchingSeat.email,
                phone:matchingSeat.phone
            }}
        })
       }

       currentBus.save();

    } catch (error) {
        next(error)
    }
}

//To cancel tickets

const cancelTicket = async (req,res,next)=>{
    const busId = req.params.id; //assuming once we are directed to the bus page, the id is added in the params
    try {
        const currentBus = await Bus.findById(busId);

        if(!currentBus){
            res.status(404).json({error: "bus not found"})
        }

        const selectedSeats = req.body.seats //req.body will contain object with key as seats and value as array of selected seats.
        //structure of the incoming req.body will be {seats:[{seatNo:"", name:"", phone:"", email:""},{seatNo:"", name:"", phone:"", email:""}]}

        //getting the seatnumber to be booked.
        const selectedSeatNumbers = selectedSeats.map((ele)=> ele.seatNo);

        //using the eselected seatnumber to check if that is already booked to avoid error
        const bookedSeats = currentBus.seats.filter((seat)=>
            selectedSeatNumbers.includes(seat.seatNumber) && seat.availability === true
        ); 

       if(bookedSeats > 0){
        res.status(404).json({
            error: "Some seats are not booked by you",
            seatNum: bookedSeats.map((seat)=> seat.seatNumber)
        })
       }else{
        currentBus.seats.map((seat)=>{
           if (selectedSeatNumbers.includes(seat.seatNumber)){
            seat.availability = true; }
        })
       }

       currentBus.save();

    } catch (error) {
        next(error)
    }
}


//Get bus details
const getBusdetails = async(req,res,next)=>{
    try {
        if(req.user.role === "customer"){
            const allBuses = await Bus.find({},{'seats.assignedTo': 0});
            res.status(400).json(allBuses)
        }else{
            res.status(500).json({error:"Not Authorised!"})
        }
      
    } catch (error) {
        res.status(500).json({error})
    }
}


module.exports = {
    bookTicket,
    cancelTicket,
    getBusdetails
}
