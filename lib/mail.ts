import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: +process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export interface transport {
  host: string;
  port: string;
  auth: Auth;
}

export interface Auth {
  user: string;
  pass: string;
}

function makeANiceEmail(text: string) {
  return `
    <div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello!</h2>
      <p>${text}</p>

      <p>Sam</p>
    </div>
  `;
}

// typing mailresponse
export interface MailResponse {
  // go to https://jvilk.com/MakeTypes/ and paste in info you've logged out, then convert to json and run through here to get types
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}
// typing envelope
export interface Envelope {
  from: string;
  // in tutorial this is marked as optional but it can't be optional for nodemailer
  to: string[] | null;
}

export async function sendPasswordResetEmail(
  // the token
  resetToken: string,
  // our email
  to: string
): Promise<void> {
  // email the user a token
  const info = (await transport.sendMail({
    // what gets passed into the password reset link from withAuth
    to,
    from: 'samara.olivia.parker@gmail.com',
    subject: 'Reset your password',
    html: makeANiceEmail(`Your password reset token:
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
    `),
  })) as MailResponse;
  // this says if we're using ethereal, grab the url to what was sent and use the nodemailer method, getTestMessageUrl, then we get a url to the email we sent
  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`💌 Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}
