const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");




//=========================================Validators===================================================//

const isValid = function (value) {
    if (!value || typeof value != "string" || value.trim().length == 0) return false;
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
    
}


//============================Create College(Post /functionup/colleges)===============================================//

const createCollege = async function (req, res) {

    try {
        const requestBody = req.body
        const isDeleted = req.body.isDeleted

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Please provide college details" })
        }
        if ( (isDeleted && typeof isDeleted != "boolean" ) || isDeleted==true) {
            return res.status(400).send({ status: false, message: "isDeleted must be false" })
        }

        const { name, fullName, logoLink } = requestBody

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is required...!" });
        }

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, message: "Full name is required....!" });
        }

        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, message: "Logo link is required....!" });
        }

        const logoLinkValidator = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).test(logoLink)
        if (!logoLinkValidator) {
            return res.status(400).send({ status: false, message: "Please enter a valid logo link " })
        }

        const isCollegeAlreadyRegistered = await collegeModel.findOne({ name })

        if (isCollegeAlreadyRegistered) {
            return res.status(400).send({ status: false, message: `${name} is already registered` })
        }
       
        const college = await collegeModel.create(requestBody);

        return res.status(201).send({ status: true, message: "college register successfully", data: college });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message, });
    }
};




//==========================Get College Interns Details(GET /functionup/collegeDetails)=================================//


const getCollegeInternsDetails = async function (req, res) {
    try {
        const query = req.query

        if (!query) return res.status(400).send({ status: false, message: "Please provide name of college in query params" })

        const nameOfCollege = req.query.collegeName

        const college = await collegeModel.findOne({ name: nameOfCollege, isDeleted: false })

        if (!college) return res.status(404).send({ status: false, message: "College not found..." })

        if (nameOfCollege == undefined) {
            return res.status(400).send({ status: false, message: "College Name is required...!" });
        }

        const internsDetails = await internModel.find({ collegeId: college._id }).select({ _id: 1, name: 1, email: 1, mobile: 1 })

        if(internsDetails.length==0){
            return res.status(404).send({ status: false, message: "No Intern found" })
        }

        const data = {
            name: college.name,
            fullName: college.fullName,
            logoLink: college.logoLink,
            interests: internsDetails
        }

        return res.status(200).send({ status: true, message: "Successful", data: data });

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createCollege, getCollegeInternsDetails }