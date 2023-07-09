const mongoose = require("mongoose");
const { strategy } = require("sharp");
// const bcrypt = require("bcrypt");
// const crypto = require("crypto");

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// Declare the Schema of the Mongo model
var patientSchema = new mongoose.Schema(
  {
    doctorId:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Doctor"
    }],

    appointmentDate:{
      type:Date
    },
    serialNumber:{
      type:Number
    },
    name: {
      type: String,
     required: true,
    },
    age:{
        type:Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      //required: 'Email address is required',
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
   
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    problems :{
        type:String
    },
    bloodPressure:{
        type:String
    },
    sugarLevel:{
        type:String
    },
    weight:{
        type:String
    },
    height:{
        type:String
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      pinCode: {
        type: Number,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
    },
    location: {
      type: {
        type: String,
      },
      coordinates: [],
    },
    
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    clinicImages: [
      {
        public_id: String,
        url: String,
      },
    ],
 
   

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
patientSchema.index({ location: "2dsphere" });



//Export the model
module.exports = mongoose.model("Patient", patientSchema);
