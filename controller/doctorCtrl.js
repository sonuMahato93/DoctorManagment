const asyncHandler = require("express-async-handler");
const doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");
const generateRefreshToken = require("../config/refreshToken");
const generateToken = require("../config/jwtToken");

// REGISTER Doctor
const createDoctor = asyncHandler(async (req, res) => {
  // get mobile from firebase token
  const mobile = req.body.mobile;

  const findUser = await doctor.findOne({ mobile });
  if (!findUser) {
    const newUser = await doctor.create(req.body);
    const refreshToken = await generateRefreshToken(newUser.id);
    newUser.refreshToken = refreshToken;
    newUser.save();
    res.json({ newUser });
  } else {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateUser = await doctor.findByIdAndUpdate(
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
      role: findUser?.role,
      token: generateToken(findUser?._id),
    });
  }
});

// UPDATE Doctor
const updateaDoctor = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.refreshToken)
    throw new Error("You are logged out 😏 🍀 Please Login");
  const { id } = req.user;
  try {
    const updateaUser = await doctor.findByIdAndUpdate(id, req?.body, {
      new: true,
    });
    res.json(updateaUser);
  } catch (error) {
    throw new Error(error);
  }
});

// // Doctor Add New Patient
// const addPatient = asyncHandler(async (req, res) => {
//   let serialNumber;
//   let start = new Date();
//   start.setHours(0, 0, 0, 0);
//   let end = new Date();
//   end.setHours(23, 59, 59, 999);
//  // console.log(end.setHours());
//   try {
//     const { id, patientId } = req.user;
//     const { name, mobile } = req.body;
//     // checking patient existing
//     const isExistingPatient = await Patient.findOne({ mobile });
//     if (isExistingPatient) {
//       // checking if patient id and doctor id are their or not
//       if (
//         patientId.includes(isExistingPatient.id) &&
//         isExistingPatient.doctorId.includes(id)
//       ) {

//         // counting number of data enter today
//         const todaysEntry = await Patient.find({
//           appointmentDate: { $gte: start, $lt: end }
//          // createdAt: { $gte: start, $lt: end },
//         }).count();
//         console.log(todaysEntry);
//         for (serialNumber = 1; serialNumber <= todaysEntry; serialNumber++) {console.log(serialNumber);}
//         return res.json({
//           msg: "Patient is Already Register !!",
//           serialNumber,
//         });
//       } else {
//         await Patient.findByIdAndUpdate(
//           isExistingPatient.id,
//           {
//             $push: {
//               doctorId: id,
//             },
//           },
//           {
//             new: true,
//           }
//         );
//         await doctor.findByIdAndUpdate(
//           id,
//           {
//             $push: {
//               patientId: isExistingPatient.id,
//             },
//           },
//           {
//             new: true,
//           }
//         );

//         const todaysEntry = await Patient.find({
//           createdAt: { $gte: start, $lt: end },
//         }).count();
//         for (serialNumber = 1; serialNumber <= todaysEntry; serialNumber++) {console.log(serialNumber);}
//         return res.json({
//           msg: "conflict user already existing !",
//           serialNumber,
//         });
//       }
//     }

//     // create new Patient
//     const user = await Patient.create({
//       mobile: req.body.mobile,
//       name: req.body.name,
//       doctorId: id,
//     });
//     await doctor.findByIdAndUpdate(
//       id,
//       {
//         $push: {
//           patientId: user.id,
//         },
//       },
//       {
//         new: true,
//       }
//     );

//     const todaysEntry = await Patient.find({
//       createdAt: { $gte: start, $lt: end },
//     }).count();
//     for (serialNumber = 1; serialNumber < todaysEntry; serialNumber++) {console.log(serialNumber);}

//     // return new user
//     return res.status(201).json({ user, serialNumber });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// Doctor Add New Patient
const addPatient = asyncHandler(async (req, res) => {
  let serialNumber;
  let start = new Date();
  start.setHours(0, 0, 0, 0);
  let end = new Date();
  end.setHours(23, 59, 59, 999);
  // console.log(end.setHours());
  try {
    const { id, patientId } = req.user;
    const { name, mobile } = req.body;
    // checking patient existing
    const isExistingPatient = await Patient.findOne({ mobile });
    if (isExistingPatient) {
// check if isExisting Patient has doctor id


      // checking if patient id and doctor id are their or not
      if (
        patientId.includes(isExistingPatient.id) &&
        isExistingPatient.doctorId.includes(id)
      ) {
        if (
          isExistingPatient.appointmentDate.toISOString().split("T")[0] !=
          new Date().toISOString().split("T")[0]
        ) {
          await Patient.findByIdAndUpdate(
            isExistingPatient.id,
            {
              appointmentDate: new Date().toISOString().split("T")[0],
            },
            {
              new: true,
            }
          );
          const todaysEntry = await Patient.find({
            appointmentDate: { $gte: start, $lt: end },
            // createdAt: { $gte: start, $lt: end },
          }).count();
          // console.log(todaysEntry);
          for (serialNumber = 1; serialNumber < todaysEntry; serialNumber++) {}

          await Patient.findByIdAndUpdate(
            isExistingPatient.id,
            {
              serialNumber: serialNumber,
            },
            {
              new: true,
            }
          );
          return res.json({
            msg: "Patient is Already Register  !!",
            serialNumber,
          });
        }
        const YourNumber = isExistingPatient.serialNumber;
        return res.json({
          msg: "Patient is Already Register doc !!",
          YourNumber,
        });
      } else {
        await Patient.findByIdAndUpdate(
          isExistingPatient.id,
          {
            $push: {
              doctorId: id,
            },
          },
          {
            new: true,
          }
        );
        await doctor.findByIdAndUpdate(
          id,
          {
            $push: {
              patientId: isExistingPatient.id,
            },
          },
          {
            new: true,
          }
        );

        if (
          isExistingPatient.appointmentDate.toISOString().split("T")[0] !=
          new Date().toISOString().split("T")[0]
        ) {
          await Patient.findByIdAndUpdate(
            isExistingPatient.id,
            {
              appointmentDate: new Date().toISOString().split("T")[0],
            },
            {
              new: true,
            }
          );

          const todaysEntry = await Patient.find({
            appointmentDate: { $gte: start, $lt: end },
            // createdAt: { $gte: start, $lt: end },
          }).count();
          // console.log(todaysEntry);
          for (serialNumber = 1; serialNumber < todaysEntry; serialNumber++) {}

          await Patient.findByIdAndUpdate(
            isExistingPatient.id,
            {
              serialNumber: serialNumber,
            },
            {
              new: true,
            }
          );
          return res.json({
            msg: "Patient is Already Register  !!",
            serialNumber,
          });
        }
        const YourNumber = isExistingPatient.serialNumber;
        return res.json({
          msg: "Patient is Already Register doc !!",
          YourNumber,
        });
      }
    }

    // create new Patient
    const user = await Patient.create({
      mobile: req.body.mobile,
      name: req.body.name,
      doctorId: id,
      appointmentDate: new Date().toISOString().split("T")[0],
    });
    await doctor.findByIdAndUpdate(
      id,
      {
        $push: {
          patientId: user.id,
        },
      },
      {
        new: true,
      }
    );

    const todaysEntry = await Patient.find({
      appointmentDate: { $gte: start, $lt: end },
    }).count();
    for (serialNumber = 1; serialNumber < todaysEntry; serialNumber++) {}
    user.serialNumber = serialNumber;
    user.save();
    // return new user
    return res.status(201).json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

// // Doctor Add New Patient
// const addPatient = asyncHandler(async (req, res) => {
//   let serialNumber;
//   let start = new Date();
//   console.log(start.toISOString().split('T')[0]);
//   let d = new Date()
//   var date = d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear().toString();
//   //start.setHours(0, 0, 0, 0);
//   let end = new Date();
//   end.setHours(23, 59, 59, 999);
//  // console.log(end.setHours());
//   try {
//     const { id, patientId } = req.user;
//     const { name, mobile } = req.body;
//     // checking patient existing
//     const isExistingPatient = await Patient.findOne({ mobile });
//     if (isExistingPatient) {
//       // checking if patient id and doctor id are their or not
//       if (
//         patientId.includes(isExistingPatient.id) &&
//         isExistingPatient.doctorId.includes(id)
//       ) {
//         // first i have to check if patient has appointment on todays date
//         // if appontment is their on todays date then check the serial number and give it to user
//         // if doest not have appointment on todays date then update appointment date and serial number
//         console.log(isExistingPatient.appointmentDate);
//       console.log(isExistingPatient.appointmentDate == date);
//         if(isExistingPatient.appointmentDate == new Date()){
//           console.log(isExistingPatient.serialNumber);
//         }
//       //   const todaysEntry = await Patient.find({
//       //     appointmentDate: { $gte: start, $lt: end },
//       //   }).count();
//       //   for (serialNumber = 1; serialNumber < todaysEntry; serialNumber++) {}

//       //   // return new user
//       //  console.log(serialNumber)

//        await Patient.findByIdAndUpdate(
//                      isExistingPatient.id,
//                      {

//                          appointmentDate: new Date(),

//                      },
//                      {
//                        new: true,
//                      }
//                    );

//     //                const todaysEntrys = await Patient.find({
//     //                 appointmentDate: { $gte: start, $lt: end },
//     //               }).count();
//     //               for (serialNumber = 1; serialNumber < todaysEntrys; serialNumber++) {}
//     // console.log(serialNumber);
//    }

//         }else {
//                   await Patient.findByIdAndUpdate(
//                     isExistingPatient.id,
//                     {
//                       $push: {
//                         doctorId: id,
//                       },
//                     },
//                     {
//                       new: true,
//                     }
//                   );
//                   await doctor.findByIdAndUpdate(
//                     id,
//                     {
//                       $push: {
//                         patientId: isExistingPatient.id,
//                       },
//                     },
//                     {
//                       new: true,
//                     }
//                   );

//                   }

//     // create new Patient
//     const user = await Patient.create({
//       mobile: req.body.mobile,
//       name: req.body.name,
//       doctorId: id,
//       appointmentDate: new Date().toISOString().split('T')[0]
//     });
//     await doctor.findByIdAndUpdate(
//       id,
//       {
//         $push: {
//           patientId: user.id,
//         },
//       },
//       {
//         new: true,
//       }
//     );

//     const todaysEntry = await Patient.find({
//       appointmentDate: { $gte: start, $lt: end },
//     }).count();
//     for (serialNumber = 1; serialNumber < todaysEntry; serialNumber++) {console.log(serialNumber);}

//     // return new user
//     return res.status(201).json({ user, serialNumber });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// Doctor Update Patient
const doctorUpdatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateaPatient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateaPatient);
  } catch (error) {
    throw new Error(error);
  }
});

// Find All Doctor
const findAllDoctor = asyncHandler(async (req, res) => {
  try {
    const allDoctors = await doctor.find();
    res.json(allDoctors);
  } catch (error) {
    throw new Error(error);
  }
});

//Logout
const logoutDoctor = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("You are logged out 😏 🍀 Please Login");
  const refreshToken = cookie.refreshToken;
  const user = await doctor.findOne({ refreshToken });
  if (!user) {
    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      })
      .sendStatus(204); // forbidden
  }
  await doctor.findOneAndUpdate(
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

const getAllPatient = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Patient.find(JSON.parse(queryStr));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Patient.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createDoctor,
  logoutDoctor,
  updateaDoctor,
  addPatient,
  doctorUpdatePatient,
  findAllDoctor,
  getAllPatient,
};
