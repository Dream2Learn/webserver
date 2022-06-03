import User from "./schema/userschema.js";
import sendEmail from "../utils/email.js";
const exports={};

exports.recover = async (req, res) => {
  try {
    console.log(1);
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        message:
          "The email address " +
          req.body.email +
          " is not associated with any account. Double-check your email address and try again.",
      });
    console.log(2);
    //Generate and set password reset token
    user.generatePasswordReset();

    // Save the updated user object
    await user.save();

    // send email
    let subject = "Password change request";
    let to = user.email;
    let from = process.env.FROM_EMAIL;
    let link =
      "http://" +
      req.headers.host +
      "/api/auth/reset/" +
      user.resetPasswordToken;
    let html = `<p>Hi ${user.username}</p>
                    <p>Please click on the following <a href="${link}">link</a> to reset your password.</p> 
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

    await sendEmail({ to, from, subject, html });

    res
      .status(200)
      .json({ message: "A reset email has been sent to " + user.email + "." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reset = async (req, res) => {
  try {
    console.log(1);
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log(2);
    if (!user)
      return res
        .status(401)
        .json({ message: "Password reset token is invalid or has expired." });

    //Redirect user to form with the email address
    console.log(3);
    res.render("login/reset.ejs", { logged_in: false, user: "" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(5);
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(401)
        .json({ message: "Password reset token is invalid or has expired." });
    console.log(6);
    //Set the new password
    user.pass = req.body.pass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isVerified = true;

    // Save the updated user object
    await user.save();
    console.log(7);
    let subject = "Your password has been changed";
    let to = user.email;
    let from = process.env.FROM_EMAIL;
    let html = `<p>Hi ${user.username}</p>
                    <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`;

    await sendEmail({ to, from, subject, html });
    console.log(8);
    res.status(200).json({ message: "Your password has been updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default exports;