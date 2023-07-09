const express = require("express");
const { createPatient, updateaPatient, logoutPatient, findAllPatient } = require("../controller/patientCtrl");
const { authMiddleware, patientMiddleware } = require("../middlewares/authMiddleware");


const router = express.Router();



router.post('/register',createPatient)
router.put('/update',patientMiddleware,updateaPatient)
router.get('/logout',logoutPatient)
router.get('/', findAllPatient)


module.exports = router;
