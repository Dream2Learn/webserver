import User from '../../model/schema/user.js';
import Token from '../../model/schema/token.js';
import sendEmail from '../../util/email.js';

const exports={};

exports.register = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    console.log(req.body);
    const nonalphanumeric = /([^a-z0-9-_]+)/gi;
    if (req.body.name.first.match(nonalphanumeric)
        || req.body.name.last.match(nonalphanumeric)) {
      return res.status(401).json({
        message: 'Your name can only contain alphanumeric characters',
      });
    }
    var newUser;
    if (user) {
      // if (user.isVerified) {
        console.log('Error: already exists user');
        return res.status(401).json({
          message:
            'The email address you have entered is already associated with another account.',
        });
      /* } else {
        newUser = user;
        newUser.email = req.body.email;
        newUser.pass = req.body.pass;
        newUser.user = req.body.user;
      } */
    } else {
      newUser = new User({ ...req.body });
    }

    const user_ = await newUser.save();
    await sendVerificationEmail(user_, req, res);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: 'Error occurred when processing your request.',
    });
  }
};

async function sendVerificationEmail(user, req, res) {
  try {
    const token = user.generateVerificationToken();

    // Save the verification token
    await token.save();

    let subject = 'Dream2Learn account verification';
    let to = user.email;
    let from = process.env.FROM_EMAIL;
    let link = 'http://' + req.headers.host + '/api/auth/verify/' + token.token;
    let html = `<p>Hi ${user.name.first}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;

    sendEmail({ to, from, subject, html });
    console.log('Is redirecting?');
    res.redirect('/emailsent');
  } catch (error) {
    res.status(500).json({
      message: 'Unable to send email. Check that the email is correct.',
    });
  }
}

exports.verify = async (req, res) => {
  if (!req.params.token)
    return res
      .status(400)
      .json({ message: 'We were unable to find a user for this token.' });

  try {
    // Find a matching token
    const token = await Token.findOne({ token: req.params.token });

    if (!token)
      return res.status(400).json({
        message:
          'We were unable to find a valid token. Your token my have expired.',
      });

    // If we found a token, find a matching user
    User.findOne({ _id: token.userId }, (err, user) => {
      if (!user)
        return res
          .status(400)
          .json({ message: 'We were unable to find a user for this token.' });

      if (user.isVerified)
        return res
          .status(400)
          .json({ message: 'This user has already been verified.' });

      // Verify and save the user
      user.isVerified = true;
      user.save(function (err) {
        if (err) return res.status(500).json({ message: err.message });

        res.status(200).redirect('/accountcreated');
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default exports;