const User = require('../models/user');
const ForgotPasswords = require('../models/forgotpassword');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey =process.env.SIB_API_KEY

//client.authentications['api-key'].apiKey = process.env.SIB_API_KEY;
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

const resetpasswordform = async (request, response, next) => {
    try {
        let id = request.params.id;
        const passwordreset = await ForgotPasswords.findByPk(id);
        if (passwordreset.isactive) {
            passwordreset.isactive = false;
            await passwordreset.save();
            response.sendFile('resetpassword.html', { root: 'views' })
        } else {
            return response.status(401).json({ message: "Link has been expired" })
        }

    } catch (error) {

    }
}

const requestresetpassword = async (request, response, next) => {
    try {
        const { email } = request.body;
        const user = await User.findOne({
            where: {
                userName: email
            }
        });
        console.log("user----",user);
        if (user) {
            const sender = {
                email: 'priyankacse303@gmail.com',
            }
            const receivers = [
                {
                    email: email
                }
            ]
            const resetresponse = await user.createForgotpassword({});
            const { id } = resetresponse;

            const emailContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <title>Password Reset</title>
              </head>
              <body>
                <h1>Reset Your Password</h1>
                <p>Click the button below to reset your password:</p>
                <button><a href="http://localhost:3000/password/reset/{{params.role}}">Reset Password</a></button>
                <!-- Include your password reset link or instructions here -->
              </body>
              </html>
            `;

            const emailParams = {
                role: id
            };
            const emailResponse = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: "Reset Your password",
                htmlContent: emailContent,
                params: emailParams
            });
            response.status(200).json({ message: 'Password reset email sent' });
        } else {
            response.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
}

const resetpassword = async (request, response, next) => {
    try {
        const { resetid, newpassword } = request.body;
        const passwordreset = await ForgotPasswords.findByPk(resetid);
        const currentTime = new Date();
        const createdAtTime = new Date(passwordreset.createdAt);
        const timeDifference = currentTime - createdAtTime;
        const timeLimit = 5 * 60 * 1000; 
        if(timeDifference <= timeLimit){
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            await User.update(
                {
                    password: hashedPassword
                },
                {
                    where: { id: passwordreset.UserId }
                }
            );
            response.status(200).json({ message: "Password reset successful." });
        }else{
            response.status(403).json({ message: "Link has expired"});
        }



    } catch (error) {
        console.error("Error resetting password:", error);
        response.status(500).json({ message: "Internal server error" });
    }
};

module.exports={
    requestresetpassword,
    resetpasswordform,
    resetpassword
}
