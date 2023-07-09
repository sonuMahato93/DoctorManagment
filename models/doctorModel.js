const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const crypto = require("crypto");


const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// Declare the Schema of the Mongo model
var doctorSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
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
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      pinCode: {
        type: Number,
        trim: true,
        required: true,
      },
      district: {
        type: String,
        trim: true,
        required: true,
      },
      state: {
        type: String,
        trim: true,
        required: true,
      },
    },
    typeOfDoctor: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
      },
      coordinates: [],
    },
    timing: {
      type: Date,
      // required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    specialist: {
      type: String,
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

    ratings: [
      {
        star: Number,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: {
          type: String,
        },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
    totalPatients: {
      type: String,
      default: 0,
    },
    recoveryrate: {
      type: String,
    },
    patientId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
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
doctorSchema.index({ location: "2dsphere" });

//Export the model
module.exports = mongoose.model("Doctor", doctorSchema);
