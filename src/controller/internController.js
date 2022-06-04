const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");



//=========================================Validators===================================================//
const isValid = function (value) {
    
    if (!value || typeof value != "string" || value.trim().length == 0) return false;
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}



//================================Create Intern(POST /functionup/interns)=====================================//


const createIntern = async function (req, res) {
    try {
        const requestBody = req.body;

        const collegeName = req.body.collegeName
        const name = req.body.name
        const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Please provide Intern details" })
        }
        
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Intern Name is required...!" });
        }
        const mobileData = req.body.mobile

        if (!isValid(mobileData)) {
            return res.status(400).send({ status: false, message: "Mobile Number is required...!" });
        }

        const convertToNumberMobileData = Number(mobileData)

        if (isNaN(convertToNumberMobileData)) {
            return res.status(400).send({ status: false, message: "Please enter a valid mobile number" })
        }
        const mobileNo = mobileData.toString();
        
        if (mobileNo.length != 10) {
            return res.status(400).send({ status: false, message: "Please enter 10 digit Mobile Number" })
        }
        if(mobileNo[0]==0){
            return res.status(400).send({ status: false, message: "Mobile No cannot start with zero" }) 
        }

        const isMobileAlreadyRegistered = await internModel.findOne({ mobile: mobileNo })

        if (isMobileAlreadyRegistered) {
            return res.status(400).send({ status: false, message: `${mobileNo} is already registered` })
        }

        const email = req.body.email

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required...!" });
        }
        
        const isEmailValid = emailValidator.test(email);

        if (!isEmailValid) {
            return res.status(400).send({ status: false, message: "Please enter a valid email id" })
        }
        const isEmailAlreadyRegistered = await internModel.findOne({ email })

        if (isEmailAlreadyRegistered) {
            return res.status(400).send({ status: false, message: `${email} is already registered` })
        }
    
        const collegeNameCheck = await collegeModel.findOne({ name: collegeName })

        if (!collegeNameCheck) {
            return res.status(400).send({ status: false, message: "College does not exist...!" });
        }
        collegeId1 = collegeNameCheck._id.toString();

        requestBody.collegeId = collegeId1

        const intern = await internModel.create(requestBody);

        return res.status(201).send({ data: intern, status: true });
    } 
    catch (error) {
        return res.status(500).send({ message: error.message, status: false });
    }
};





module.exports = { createIntern }