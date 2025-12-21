import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

// Configure your email transporter
// Option 1: Gmail (for testing - enable "Less secure apps" or use App Password)
// Option 2: SMTP service like SendGrid, Mailgun, etc.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || functions.config().email?.user,
    pass: process.env.EMAIL_PASS || functions.config().email?.pass,
  },
});

// Email template for replies
const createEmailTemplate = (
  recipientName: string,
  replyMessage: string,
  repliedBy: string,
  submissionType: string
) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
    .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
    .footer { background: #333; color: #999; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HUMSJ - Reply Notification</h1>
    </div>
    <div class="content">
      <p>Assalamu Alaikum <strong>${recipientName}</strong>,</p>
      <p>You have received a reply regarding your <strong>${submissionType}</strong> submission:</p>
      <div class="message-box">
        <p>${replyMessage}</p>
      </div>
      <p><em>Replied by: ${repliedBy}</em></p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>JazakAllah Khair,<br>HUMSJ Team</p>
    </div>
    <div class="footer">
      <p>Hayatul Uloom Masjid San Jose</p>
      <p>This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Generic function to handle replies for any collection
const handleReplyNotification = async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  collectionName: string,
  submissionType: string
) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();

  if (!afterData) return null;

  const beforeReplies = beforeData?.replies || [];
  const afterReplies = afterData.replies || [];

  // Check if a new reply was added
  if (afterReplies.length <= beforeReplies.length) {
    return null;
  }

  // Get the latest reply
  const latestReply = afterReplies[afterReplies.length - 1];
  const recipientEmail = afterData.email;
  const recipientName = afterData.fullName || afterData.name || afterData.childName || "User";

  if (!recipientEmail) {
    console.log("No email found for recipient");
    return null;
  }

  const mailOptions = {
    from: `"HUMSJ" <${process.env.EMAIL_USER || functions.config().email?.user}>`,
    to: recipientEmail,
    subject: `HUMSJ - Reply to your ${submissionType} submission`,
    html: createEmailTemplate(
      recipientName,
      latestReply.message,
      latestReply.repliedBy,
      submissionType
    ),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${recipientEmail}`);
    return { success: true, email: recipientEmail };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Cloud Functions for each collection
export const onHelpRegistrationReply = functions.firestore
  .document("helpRegistrations/{docId}")
  .onUpdate((change) => handleReplyNotification(change, "helpRegistrations", "Help Request"));

export const onChildrenRegistrationReply = functions.firestore
  .document("childrenRegistrations/{docId}")
  .onUpdate((change) => handleReplyNotification(change, "childrenRegistrations", "Children Registration"));

export const onMonthlyCharityReply = functions.firestore
  .document("monthlyCharityRegistrations/{docId}")
  .onUpdate((change) => handleReplyNotification(change, "monthlyCharityRegistrations", "Monthly Charity"));

export const onCharityDistributionReply = functions.firestore
  .document("charityDistributions/{docId}")
  .onUpdate((change) => handleReplyNotification(change, "charityDistributions", "Charity Distribution"));

export const onContactReply = functions.firestore
  .document("contacts/{docId}")
  .onUpdate((change) => handleReplyNotification(change, "contacts", "Contact Message"));
