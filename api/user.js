import express from "express";
import User from "../model/schema/user.js";

const router = express.Router();

router.get("/", (req, res) => {
    const returnObj = {user: req.isAuthenticated() ? req.user.user : ""};
    return res.status(200).json(returnObj);
});

router.get("/:userid",async (req,res) => {
    try {
        var user=await User.findById(req.params.userid).select("-pass -isVerified -resetPasswordToken -resetPasswordExpires");
        console.log(user);
        res.status(200).json(user);
    }catch(e) {
        console.log(e);
        res.status(401).json(e);
    }
    
});

export default router;