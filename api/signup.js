import express from "express";
import Session from "../model/schema/session.js";
import { allowLoggedInOnly } from "../util/express-middleware.js";
const router=express.Router();
router.post("/",
    allowLoggedInOnly,
    async (req, res) => {
        // if(!req.user.hasPermission("signup")) return res.status(403).json({message:"Not enough permissions!"})
        if (req.user.isTutor) return res.status(403).json({message: "Tutors may not register for sessions"});
        
        var session=await Session.findById(req.body.sessionId);
        if (!session) {
            return res.status(404).json({message:"Could not find session!"})
        }
        if (session.reserved) {
            return res.status(403).json({message:"Session already has a student signed up!"})
        }
        session.studentId = req.user._id;
        await session.save();
        return res.status(200).json(session);
    },
);
export default router;