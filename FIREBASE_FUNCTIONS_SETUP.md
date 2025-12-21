# Firebase Cloud Functions Setup - Email Notifications

This guide will help you deploy the email notification system for HUMSJ.

## Prerequisites

1. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Blaze Plan** (Pay as you go) - Required for Cloud Functions
   - Go to Firebase Console → Your Project → Upgrade to Blaze plan
   - Note: You only pay for what you use, and there's a generous free tier

## Setup Steps

### 1. Login to Firebase
```bash
firebase login
```

### 2. Initialize Firebase in your project (if not already done)
```bash
firebase init
```
Select "Functions" when prompted.

### 3. Install dependencies
```bash
cd functions
npm install
```

### 4. Configure Email Credentials

**Option A: Using Gmail (Recommended for testing)**

1. Go to https://myaccount.google.com/apppasswords
2. Generate an App Password for "Mail"
3. Set the credentials:

```bash
firebase functions:config:set email.user="your-email@gmail.com" email.pass="your-app-password"
```

**Option B: Using SendGrid**

Modify `functions/src/index.ts` transporter:
```typescript
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: functions.config().sendgrid.key,
  },
});
```

Then set:
```bash
firebase functions:config:set sendgrid.key="your-sendgrid-api-key"
```

### 5. Build and Deploy
```bash
cd functions
npm run build
firebase deploy --only functions
```

## Testing

1. Go to your Admin Dashboard
2. Find a submission with an email address
3. Click "Reply" and send a message
4. The recipient should receive an email notification

## Monitoring

View function logs:
```bash
firebase functions:log
```

Or in Firebase Console → Functions → Logs

## Collections Covered

The following collections will trigger email notifications on reply:
- `helpRegistrations` - Help Request submissions
- `childrenRegistrations` - Children Registration submissions
- `monthlyCharityRegistrations` - Monthly Charity submissions
- `charityDistributions` - Charity Distribution submissions
- `contacts` - Contact form messages

## Troubleshooting

**Email not sending?**
1. Check Firebase Functions logs for errors
2. Verify email credentials are set correctly
3. For Gmail, ensure App Password is used (not regular password)
4. Check spam folder of recipient

**Function not triggering?**
1. Ensure the document has an `email` field
2. Verify the `replies` array is being updated correctly
3. Check that you're on the Blaze plan

## Cost Estimate

Firebase Functions free tier includes:
- 2 million invocations/month
- 400,000 GB-seconds/month
- 200,000 CPU-seconds/month

For a small organization, this should be more than sufficient.
