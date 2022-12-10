import nodemailer from "nodemailer";

interface Options {  // <--- interface are used to define the shape of an object or a function
    to: string,
    subject: string,
    text?: string,
    html?: string,  // the ? means that the property is optional and can be omitted when creating an object of this type
}

const sendEmail = async (options: Options) => {

    const transporter = nodemailer.createTransport({ // <--- createTransport is a method of the nodemailer module that allows you to create a transporter object that will be used to send emails
        host: 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.text

    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    })
}

export default sendEmail;


