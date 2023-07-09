const catchAsyncError = (passFunction) => (req, res, next) => {
    Promise.resolve(passFunction(req, res, next)).catch(next);
  };
 
 const createError = require('http-errors') 




const NotFound = (async (req, res, next) => {
    next(createError.NotFound());
  });
  
  const ValidationError = ((err, req, res, next) => {
    if (err.name === "ValidationError") {
      return res.status(400).send({
        type: "ValidationError",
        message: err.message,
        //details: error.details,
      });
    }
    if (err.name === "CastError") {
      return res.status(400).send({
        status: err.status,
        type: "CastError",
        message:
          err.message ||
          "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
      });
    }
    // if (error instanceof mongoose.CastError) {
    //   return res.status(400).send({"Invalid Member Id"}) "Invalid Member Id"));
    // }
    res.status(err.status || 500);
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  });




   
  module.exports = {catchAsyncError,NotFound, ValidationError};