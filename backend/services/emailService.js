const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  generateApplicationEmail(application) {
    const { name, email, phone, experience, coverLetter, jobTitle, createdAt } = application;
    
    return {
      to: email,
      subject: `Application Received - ${jobTitle} at ${process.env.COMPANY_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Application Confirmation</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for applying!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${name}</strong>,<br><br>
              We have successfully received your application for the position of <strong>${jobTitle}</strong>. 
              Our team will review your application and get back to you soon.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">Application Details:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li><strong>Position:</strong> ${jobTitle}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${phone}</li>
                <li><strong>Experience:</strong> ${experience}</li>
                <li><strong>Submitted:</strong> ${new Date(createdAt).toLocaleDateString()}</li>
              </ul>
            </div>
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #2196F3; margin-top: 0;">What happens next?</h4>
              <p style="color: #666; margin: 0; line-height: 1.6;">
                1. Our hiring team will review your application<br>
                2. If your profile matches our requirements, we'll contact you for an interview<br>
                3. You'll receive updates on your application status via email
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${process.env.COMPANY_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };
  }

  generateAdminNotificationEmail(application) {
    const { name, email, phone, experience, coverLetter, jobTitle, createdAt } = application;
    
    return {
      to: process.env.EMAIL_FROM,
      subject: `New Application Received: ${name} for ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Job Application</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Admin Notification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Application Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
              <h3 style="color: #333; margin-top: 0;">Candidate Information:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${phone}</li>
                <li><strong>Position:</strong> ${jobTitle}</li>
                <li><strong>Experience:</strong> ${experience}</li>
                <li><strong>Submitted:</strong> ${new Date(createdAt).toLocaleString()}</li>
              </ul>
            </div>
            
            ${coverLetter ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Cover Letter:</h3>
              <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${coverLetter}</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${email}" style="background: #ff6b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Contact Candidate
              </a>
            </div>
          </div>
        </div>
      `
    };
  }

  async sendApplicationConfirmation(application) {
    try {
      const emailOptions = this.generateApplicationEmail(application);
      await this.transporter.sendMail(emailOptions);
      console.log(`✅ Application confirmation sent to ${application.email}`);
      return { success: true, message: 'Application confirmation sent successfully' };
    } catch (error) {
      console.error('❌ Error sending application confirmation:', error);
      return { success: false, error: error.message };
    }
  }

  async sendAdminNotification(application) {
    try {
      const emailOptions = this.generateAdminNotificationEmail(application);
      await this.transporter.sendMail(emailOptions);
      console.log(`✅ Admin notification sent for application from ${application.name}`);
      return { success: true, message: 'Admin notification sent successfully' };
    } catch (error) {
      console.error('❌ Error sending admin notification:', error);
      return { success: false, error: error.message };
    }
  }

  generateOTPEmail(email, otp) {
    return {
      to: email,
      subject: `Your Verification Code - ${process.env.COMPANY_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Email Verification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Your Verification Code</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Use the code below to verify your email address and complete your registration.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center; border-left: 4px solid #667eea;">
              <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0;">
                ${otp}
              </div>
              <p style="color: #999; font-size: 14px; margin: 10px 0 0 0;">6-digit verification code</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h4 style="color: #856404; margin-top: 0;">Important:</h4>
              <ul style="color: #856404; line-height: 1.6; margin: 10px 0;">
                <li>This code will expire in 5 minutes</li>
                <li>Never share this code with anyone</li>
                <li>Only enter it on the ${process.env.COMPANY_NAME} website</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                If you didn't request this code, please ignore this email.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${process.env.COMPANY_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };
  }

  async sendOTPEmail(email, otp) {
    try {
      const emailOptions = this.generateOTPEmail(email, otp);
      await this.transporter.sendMail(emailOptions);
      console.log(`✅ OTP email sent to ${email}`);
      return { success: true, message: 'OTP email sent successfully' };
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      return { success: false, error: error.message };
    }
  }

  generatePasswordResetEmail(email, otp) {
    return {
      to: email,
      subject: `Password Reset Code - ${process.env.COMPANY_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Password Reset</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your password. Use the code below to proceed with the password reset.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center; border-left: 4px solid #ff6b6b;">
              <div style="font-size: 32px; font-weight: bold; color: #ff6b6b; letter-spacing: 8px; margin: 10px 0;">
                ${otp}
              </div>
              <p style="color: #999; font-size: 14px; margin: 10px 0 0 0;">6-digit reset code</p>
            </div>
            
            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h4 style="color: #721c24; margin-top: 0;">Security Notice:</h4>
              <ul style="color: #721c24; line-height: 1.6; margin: 10px 0;">
                <li>This code will expire in 5 minutes</li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this, please contact support immediately</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                If you didn't request a password reset, please ignore this email.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${process.env.COMPANY_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };
  }

  async sendPasswordResetEmail(email, otp) {
    try {
      const emailOptions = this.generatePasswordResetEmail(email, otp);
      await this.transporter.sendMail(emailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  generateContactEmail(contact) {
    const { name, email, message, subject, createdAt } = contact;
    
    return {
      to: email,
      subject: `Thank you for contacting ${process.env.COMPANY_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Contact Confirmation</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for reaching out!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${name}</strong>,<br><br>
              We have received your message and will get back to you as soon as possible.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">Your Message:</h3>
              <p style="color: #666; margin-bottom: 10px;"><strong>Subject:</strong> ${subject}</p>
              <p style="color: #666; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                This is an automated message. We'll respond to your inquiry shortly.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${process.env.COMPANY_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };
  }

  generateAdminContactNotification(contact) {
    const { name, email, message, subject, createdAt } = contact;
    
    return {
      to: process.env.EMAIL_FROM,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Message</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Admin Notification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
              <h3 style="color: #333; margin-top: 0;">From:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Subject:</strong> ${subject}</li>
                <li><strong>Submitted:</strong> ${new Date(createdAt).toLocaleString()}</li>
              </ul>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="color: #666; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${email}" style="background: #ff6b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reply to ${name}
              </a>
            </div>
          </div>
        </div>
      `
    };
  }

  async sendContactNotification(contact) {
    try {
      const emailOptions = this.generateContactEmail(contact);
      await this.transporter.sendMail(emailOptions);
      console.log(`✅ Contact confirmation sent to ${contact.email}`);
      return { success: true, message: 'Contact confirmation sent successfully' };
    } catch (error) {
      console.error('❌ Error sending contact confirmation:', error);
      return { success: false, error: error.message };
    }
  }

  async sendAdminContactNotification(contact) {
    try {
      const emailOptions = this.generateAdminContactNotification(contact);
      await this.transporter.sendMail(emailOptions);
      console.log(`✅ Admin contact notification sent for message from ${contact.name}`);
      return { success: true, message: 'Admin contact notification sent successfully' };
    } catch (error) {
      console.error('❌ Error sending admin contact notification:', error);
      return { success: false, error: error.message };
    }
  }

  async sendApplicationNotifications(application) {
    const results = await Promise.all([
      this.sendApplicationConfirmation(application),
      this.sendAdminNotification(application)
    ]);
    
    return {
      candidateEmail: results[0],
      adminEmail: results[1],
      success: results[0].success && results[1].success
    };
  }
}

module.exports = EmailService;
