const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const doctorRoutes = require('./router/doctorRoutes');
const patientRoutes = require('./router/patientRoutes')
const { NotFound,ValidationError } = require("./middlewares/errorHandler");

dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());



app.use('/api/doctor',doctorRoutes)
app.use('/api/patient',patientRoutes)



app.use(NotFound)
app.use(ValidationError)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
