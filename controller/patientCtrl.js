const asyncHandler = require("express-async-handler");
const doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");
const generateRefreshToken = require("../config/refreshToken");
const generateToken = require("../config/jwtToken");

// REGISTER USER
const createPatient = asyncHandler(async (req, res) => {
  // get mobile from firebase token
  const mobile = req.body.mobile;

  const findUser = await Patient.findOne({ mobile });
  if (!findUser) {
    const newUser = await Patient.create(req.body);
    const refreshToken = await generateRefreshToken(newUser.id);
    newUser.refreshToken = refreshToken;
    newUser.save();
    res.json({ newUser });
  } else {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateUser = await Patient.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      isActive: findUser?.isActive,
      token: generateToken(findUser?._id),
    });
  }
});

// UPDATE USER
const updateaPatient = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.refreshToken)
    throw new Error("You are logged out 😏 🍀 Please Login");
  const { id } = req.user;
  try {
    const updateaUser = await Patient.findByIdAndUpdate(id, req?.body, {
      new: true,
    });
    res.json(updateaUser);
  } catch (error) {
    throw new Error(error);
  }
});

const findAllPatient = asyncHandler(async (req, res) => {
  try {
    const allDoctors = await Patient.find().populate("doctorId", [
      "firstname",
      "lastname",
      "ratings",
      "mobile",
      "typeOfDoctor",
    ]);
    res.json(allDoctors);
  } catch (error) {
    throw new Error(error);
  }
});

const logoutPatient = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("You are logged out 😏 🍀 Please Login");
  const refreshToken = cookie.refreshToken;
  const user = await Patient.findOne({ refreshToken });
  if (!user) {
    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      })
      .sendStatus(204); // forbidden
  }
  await Patient.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  return res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    })
    .json({ message: "Successfully logged out 😏 🍀" }); // forbidden
});

module.exports = {
  createPatient,
  updateaPatient,
  logoutPatient,
  findAllPatient,
};
