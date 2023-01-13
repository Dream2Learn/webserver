import express from "express";
import mongoose from "mongoose";
import User from "../model/schema/user.js";
import path from "path"
import { baseViewParams } from "../util/base-view-objects.js";
import { requestLogin } from "../util/express-middleware.js";

const router = express.Router();

function standardroute(routePath, viewPath) {
  router.get(routePath, (req, res) => {
    res.render(viewPath, baseViewParams(req));
    // res.sendFile(path.join(process.cwd(),"views",fn));
  });
}

function filterLoggedIn(routePath) {
  router.get(routePath, (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/login');
  });
}
function filterLoggedOut(routePath) {
  router.get(routePath, (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  });
}
filterLoggedIn('/logout');
filterLoggedIn('/upload');

filterLoggedOut('/login');
filterLoggedOut('/register');
filterLoggedOut('/resetpassword');
filterLoggedOut('/emailsent');
filterLoggedOut('/registersuccess');
filterLoggedOut('/resetpasswordsent');

standardroute('/', 'home/index.ejs');
standardroute('/login', 'login/login.ejs');
standardroute('/register', 'login/register.ejs');
standardroute('/resetpassword', 'login/resetpassword.ejs');
standardroute('/emailsent', 'login/emailsent.ejs');
standardroute('/resetpasswordsent', 'login/resetpasswordsent.ejs');
standardroute('/resetpasswordsuccess', 'login/resetpasswordsuccess.ejs');
standardroute('/accountcreated', 'login/accountcreated.ejs');
standardroute('/test', 'static/test.ejs');
standardroute('/create', 'main/main.ejs');
standardroute('/legal/terms', 'legal/terms.ejs');

const loginRouter = express.Router();
loginRouter.get("/student", (request, response, next) => {
    if (request.isAuthenticated()) {
        return response.redirect("/findtutors");
    }
    response.render("login/student.ejs", baseViewParams(request));
});
loginRouter.get("/tutor", (request, response, next) => {
    if (request.isAuthenticated() && request.user.isTutor) {
        return response.redirect("/me");
    } else if (request.isAuthenticated() && !request.user.isTutor) {
        return response.redirect("/tutorapply");
    }
    response.render("login/tutor.ejs", baseViewParams(request));
});

router.use("/login", loginRouter);

router.get('/logout', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    } 
    req.logout(error => {
        res.render('login/logout.ejs', baseViewParams(req));
    });
});

router.get("/tutorapply",
    requestLogin,
    (request, response, next) => {
        if (request.user.isTutor) {
            return response.redirect("/me");
        }
        response.render("login/tutorapply.ejs", baseViewParams(request));
    },
);

export default router;