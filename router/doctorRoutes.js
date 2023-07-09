const express = require("express");
const {createDoctor, logoutDoctor, updateaDoctor, addPatient, doctorUpdatePatient, findAllDoctor, getAllPatient} = require("../controller/doctorCtrl");
const { authMiddleware, isDoctor } = require("../middlewares/authMiddleware");
const { doctorImgResize, uploadPhoto } = require("../middlewares/uploadImage");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");

const router = express.Router();

router.post('/register',createDoctor)
router.put('/update',authMiddleware,updateaDoctor)
router.put('/uploadImage',authMiddleware,uploadPhoto.array("images", 10),doctorImgResize,uploadImages)
router.get("/",findAllDoctor)
router.get("/allPatient",authMiddleware,getAllPatient)

router.post('/addPatient',authMiddleware,addPatient)
router.put('/updatePatient/:id',authMiddleware,isDoctor,doctorUpdatePatient)

router.delete('/deleteImage/:id',authMiddleware,deleteImages)
router.get('/logout',logoutDoctor)

module.exports = router;
