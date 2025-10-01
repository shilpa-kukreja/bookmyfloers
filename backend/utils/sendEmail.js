// import nodemailer from 'nodemailer'

// const sendEmail = async (mailoption) => {
//     const transporter = nodemailer.createTransport({
//         host: "mail.bookmyflowers.shop",
//         port: 465,
//         secure: true,
//         auth : {
//             user : process.env.ADMIN_EMAIL,
//             pass : process.env.ADMIN_PASSWORD
//             }
//         });
//         const mailOptions = {
//             from: `"Book My Flowers" <${process.env.ADMIN_EMAIL}>`,
//             to: mailoption.to,
//             subject: mailoption.subject,
//             html: mailoption.text,
//             text : ''
//         };
//         await transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.log(error);
//                 return false;
//             }
//              console.log('Email sent: ' + info.response);
//              return true;
//         });

            
// };

//     export default sendEmail;

import nodemailer from "nodemailer";

const sendEmail = async (mailoption) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.ADMIN_EMAIL,     // support@bookmyflowers.shop
        pass: process.env.ADMIN_PASSWORD   // your email password
      }
    });

    const mailOptions = {
      from: `"Book My Flowers" <${process.env.ADMIN_EMAIL}>`,
      to: mailoption.to,
      subject: mailoption.subject,
      html: mailoption.text || "",   // HTML body
      text: ""    // Fallback text
    };

    // Verify SMTP connection (optional but helps debug)
    await transporter.verify();
    console.log("✅ SMTP connection is working");

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    return true;
  } catch (error) {
    console.error("❌ Email send error:", error);
    return false;
  }
};

export default sendEmail;
