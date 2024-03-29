import express from "express";

import User from "../model/schema/user.js";
import { baseViewParams } from "../util/base-view-objects.js";
import { requestLogin } from "../util/express-middleware.js";


export const tutorRouter = express.Router();
tutorRouter.get("/:id/",
	requestLogin,
	async (request, response, next) => {
		try {
			const tutor = await User.findOne({
				_id: request.params.id,
				permissions: "post-session",
			});

			if (!tutor || !tutor.isTutor) {
				return next();
			}

			response.render("user/tutor.ejs", {
				...baseViewParams(request),
				tutor,
			});
			// res.sendFile(path.join(process.cwd(),"views",fn));
		} catch (error) {
			response.status(500).json(error);
		}
	},
);

/* tutorRouter.get("/app.js", (request, response) => {
	// Change path alongside ./pages/tutor/vite.config.ts
	response.sendFile(path.resolve("./pages/tutor/dist/index.js"));
});

tutorRouter.get("/app.css", (request, response) => {
	response.sendFile(path.resolve("./pages/dist/style.css"));
}); */

export const studentRouter = express.Router();
studentRouter.get("/:id/",
	requestLogin,
	async (request, response, next) => {
		if (!request.user.isStaff && request.user._id.toString() !== request.params.id) {
			response.sendStatus(403);
			return;
		}

		const student = await User.findOne({
			_id: request.params.id,
			permissions: {
				$ne: "post-session",
			},
		});

		if (!student) {
			response.sendStatus(404);
			return next();
		}

		response.render("user/student.ejs", {
			...baseViewParams(request),
			student,
		});
		// res.sendFile(path.join(process.cwd(),"views",fn));
	},
);

export const manageRouter = express.Router();
manageRouter.get("/",
	requestLogin,
	async (request, response, next) => {
		response.render("login/manage-account.ejs", baseViewParams(request));
	},
);