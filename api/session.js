import express from "express";
import Session, { compareSessions } from "../model/schema/session.js";
const router = express.Router();

router.get("/fromtutor/:tutor",async (req,res) => {
    var tutor=req.params.tutor;

    var results=await Session.find({tutor}).sort("begin").lean();
    res.status(200).json(results);
})

router.get("/fromstudent/:student",async (req,res) => {
    var student=req.params.student

    var results=await Session.find({student}).sort("begin").lean();
    res.status(200).json(results);
})

router.get("/fromsubject/:subject", async (req,res) => {
    const subjects = req.params.subject.split("|");
    
    const sessions = await Session.find({
        $and: [{
            student: "",
        }],

        $or: subjects.map(subject => ({subject})),
    })
            .sort("begin")
            .lean()
            .select("_id begin duration tutor subject student");
    res.status(200).json(sessions);
})

router.get("/", async (request, response) => {
    const subjects = request.query.subject?.split("|") ?? null;

    const sessions = (await Session.find({
        $and: [
            subjects ? {
                $or: subjects.map(subject => ({subject})),
            } : {},
        ],
    })
            .lean()
            .select("_id begin duration tutor subject student")
    )
            .sort(compareSessions);
    response.status(200).json(sessions);
})

router.post("/", async (req,res) => {
    try {
        if(!req.isAuthenticated()) return res.status(401).json({message:"Not logged in!"});
    
        if(!req.user.hasPermission("post-session")) return res.status(401).json({message:"You don't have enough permissions!"});

        const session = new Session({
            begin: req.body.begin,
            duration: req.body.duration,
            tutor: req.user.user,
            subject: req.body.subject,
        });
        await session.save();
        return res.status(200).json(session);
    }catch(e) {
        console.log(e);
        return res.status(400).json({message:"error"})
    }
})

export default router;