const doctor = require("../models/doctorModel");
const Patient = require('../models/patientModel')
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1] ;
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await doctor.findById(decoded?.id);
        if(user.isActive){
        req.user = user;
        }
        else{throw new Error("forbidden")}
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, Please Login again");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});


const patientMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1] ;
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Patient.findById(decoded?.id);
        if(user.isActive){
        req.user = user;
        }
        else{throw new Error("forbidden")}
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, Please Login again");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});



const isDoctor = asyncHandler(async (req, res, next) => {
  const { mobile } = req.user;
  const doctorUser = await doctor.findOne({ mobile });
  if (doctorUser.role !== "doctor") {
    throw new Error("You are not Doctor");
  } else {
    next();
  }
});





module.exports = { authMiddleware, isDoctor, patientMiddleware };