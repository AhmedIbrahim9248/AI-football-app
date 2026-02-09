import { EventEmitter } from "node:events";
import { sendEmail } from "../email/sendEmail.js";
import { verify_templet } from "../email/templates/verify.template.js";

 const event = new EventEmitter()

event.on("confirm_email", async (data) => {

    await sendEmail({
        to: data.to, 
        subject: data.subject || "confirm email",
         html: verify_templet({ otp:data.otp})
    }).catch(error => {
        console.log(`falid to send email to ${data.to}`);

    })

})

export default event