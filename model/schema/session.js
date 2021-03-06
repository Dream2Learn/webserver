import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({
    tutor: {
        type: String,
        required: true,
    },

    begin: {
        type: Number,
    },

    startDate: {
        type: Date,
    },

    duration: {
        type: Number,
        required: true,
    },

    subject: {
        type: String,
        required: true,
    },

    student: {
        type: String,
    },

    confirmed: {
        type: Boolean,
        default: false,
    },

    confirmationWaitlist: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "Student",
        }],
    },

    meetingUrl: {
        type: String,
    },
});

sessionSchema.virtual("reserved").get(function () { return Boolean(this.student); });


const Session = mongoose.model("Session", sessionSchema);
export default Session;

/**
 * Sorts sessions by the following criteria, in this order:
 * 1. Sessions reserved by the given user come first
 * 1. Remaining open sessions come first
 * 1. Start time, ascending
 * @param {*} username 
 * @returns A sorting comparator for sessions.
 */
export const compareSessions = username =>
        (a, b) =>
                Number(b.student === username) - Number(a.student === username)
                || Number(Boolean(a.student)) - Number(Boolean(b.student))
                || (a.startDate?.getTime() ?? 0) - (b.startDate?.getTime() ?? 0)
                || (a.begin ?? 0) - (b.begin ?? 0);