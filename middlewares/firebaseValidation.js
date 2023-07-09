const admin = require('../config')
const asyncHandler = require("express-async-handler");

const firebaseIdToken = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1] ;
      try {
        if (token) {
     const decodeValue = await admin.auth().verifyIdToken(firebaseIdToken)
     const mobile = decodeValue.mobile
     next()
        }
      } catch (error) {
        throw new Error("Not Authorized token expired");
      }
    } else {
      throw new Error("There is no token attached to header");
    }
  });