const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to:         email,
        from:       "petergm@gmail.com",
        subject:    "Welcome to the App!",
        text:       `Welcome to the app, ${name}.  Let me know how you get along with the app.`,
        /*  NB: There's an "html" property in the sgMail.send() argument.  You can send html 
            (with in-line CSS?) instead of plain text to style your email. */
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to:         email,
        from:       "petergm@gmail.com",
        subject:    "We're sorry to see you go.",
        text:       `Hi ${name},\n\nWe're sorry to see you go. We would love to hear your
                    feedback on our app, and why you're leaving, so we can improve it in the future.\n\n
                    If you have a chance, reply to this email and provide your feedback.  Thanks!\n\n
                    The Task Management App Team`,
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail,
}