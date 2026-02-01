# Email Configuration Setup

## Gmail SMTP Setup

To use the email notification system, you need to configure Gmail SMTP:

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication

### 2. Generate App Password
- Go to Google Account → Security → App Passwords
- Generate a new app password for "Mail" on "Windows Computer"
- Copy the generated password

### 3. Update .env file
Replace the following in your `.env` file:

```env
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-actual-gmail@gmail.com
COMPANY_NAME=Your Company Name
```

## Features

The AI Email Service provides:

1. **Candidate Confirmation Email** - Professional email to applicants confirming submission
2. **Admin Notification Email** - Instant notification to administrators about new applications
3. **Beautiful HTML Templates** - Modern, responsive email designs
4. **Error Handling** - Graceful handling of email failures
5. **Logging** - Comprehensive logging for debugging

## Email Templates Include

- Company branding with gradient headers
- Application details summary
- Next steps information
- Professional formatting
- Contact buttons for admin notifications

## Testing

To test the email functionality:

1. Start the server: `npm run dev`
2. Submit a test application through the frontend
3. Check both:
   - Applicant's email inbox for confirmation
   - Admin email for notification
4. Check server console for email sending logs

## Troubleshooting

- **Authentication failed**: Check Gmail app password setup
- **Email not sent**: Verify SMTP credentials and network connectivity
- **Spam folder**: Check spam/junk folders for test emails
