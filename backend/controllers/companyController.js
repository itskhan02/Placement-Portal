const Company = require("../models/Company");
const User = require("../models/User");
const mongoose = require("mongoose");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createCompany = async (req, res) => {
  try {
    const { companyName, description, website, location } = req.body;
    
    if (!companyName){
      return res.status(400).json({success: false, msg: "Company name is required"});
    }

    let company = await Company.findOne({
      name: { $regex: `^${companyName}$`, $options: "i" },
      userId: req.user._id,
    });

    if (company) {
      return res.status(400).json({success: false, msg: "Company already exists"});
    }

    const uploadedLogo = req.file ? await uploadToCloudinary(req.file, req) : null;

    company = await Company.create({
      name: companyName,
      description,
      website,
      location,
      logo: uploadedLogo?.secure_url || "",
      logoPublicId: uploadedLogo?.public_id || "",
      logoResourceType: uploadedLogo?.resource_type || "image",
      userId: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      "profile.company": company._id,
    });

    return res.status(201).json({message: "Company created successfully", company, success: true});

  } catch (err) {
    return res.status(500).json({success: false, msg: err.message || "Error creating company"});
  }
};


//get all companies 
exports.getAllCompanies = async (req, res) => {
  try {
    const userId = req.user._id;
    const companies = await Company.find({ userId });
    if (companies.length === 0){
      return res.status(404).json({message: " No companies found"});
    }
    return res.status(200).json({ companies, success: true });
  } catch (err) {
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};


//get single company

exports.getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    if (!companyId || !isValidObjectId(companyId)) {
      return res.status(400).json({ success: false, msg: "Invalid company ID" });
    }

    const company = await Company.findById(companyId)
    .populate("userId", "name email");
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ company, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: err.message || "Server error" });
  }
};


//update company

exports.updateCompany = async (req, res) => {
  try {
    const { name, description, location, website, isPublic } = req.body;
    const file = req.file;
    const companyId = req.params.id;

    if (!companyId || !isValidObjectId(companyId)) {
      return res.status(400).json({ success: false, msg: "Invalid company ID" });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (name !== undefined) company.name = name;
    if (description !== undefined) company.description = description;
    if (location !== undefined) company.location = location;
    if (website !== undefined) company.website = website;
    if (isPublic !== undefined) company.isPublic = isPublic;

    if (file) {
      const uploadedLogo = await uploadToCloudinary(file, req);

      if (company.logoPublicId) {
        await deleteFromCloudinary(
          company.logoPublicId,
          company.logoResourceType || "image",
        );
      }

      company.logo = uploadedLogo.secure_url;
      company.logoPublicId = uploadedLogo.public_id;
      company.logoResourceType = uploadedLogo.resource_type;
    }

    await company.save();

    res.status(200).json({
      message: "Company updated successfully",
      company,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Server error",
    });
  }
};



