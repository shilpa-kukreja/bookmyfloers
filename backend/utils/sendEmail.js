import nodemailer from 'nodemailer'

const sendEmail = async (mailoption) => {
    const transporter = nodemailer.createTransport({
        host: "mail.bookmyflowers.shop",
        port: 465,
        secure: true,
        auth : {
            user : process.env.ADMIN_EMAIL,
            pass : process.env.ADMIN_PASSWORD
            }
            });
        const mailOptions = {
            from: '"Book My Flowers' + process.env.ADMIN_EMAIL,
            to: mailoption.to,
            subject: mailoption.subject,
            html: mailoption.text,
            text : ''
        };
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return false;
            }
             console.log('Email sent: ' + info.response);
             return true;
        });

            
        };

    export default sendEmail;