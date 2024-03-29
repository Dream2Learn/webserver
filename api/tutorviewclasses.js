import express from "express"
import Session from "../model/schema/session.js";
import User from "../model/schema/user.js";
import { allowTutorOnly } from "../util/express-middleware.js";

const router=express.Router();
router.post("/",
    allowTutorOnly,
    async (req,res) => {
        const session=await Session.findById(req.body.session);
        if(!session) return res.status(401).json({message:"No such session!"})
        if(session.tutorId.toString() !== req.user._id.toString()) return res.status(401).json({message:"You are not the tutor!"});

        switch (req.body.operation) {
            case "delete":
                await Session.findByIdAndDelete(req.body.session);
                return res.status(200).json({message:"Operation Successful"})

            case "kick":
                session.studentId = null;
                session.confirmed = false;
                await session.save();
                return res.status(200).json({message:"Operation successful"})

            case "confirm":
                session.confirmed = true;
                await session.save();
                return res.status(200).json({message:"Operation successful"});

            default:
                return res.status(401).json({message:"Invalid operation!"});
        }
    },
);
export default router;