import CONFIG from '@/core/config';
import nodemailer, { SendMailOptions } from 'nodemailer';

class EmailService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: CONFIG.smtp.host,
      port: CONFIG.smtp.port,
      auth: {
        user: CONFIG.smtp.user,
        pass: CONFIG.smtp.password,
      },
    });

    // Verify SMTP connection
    this.transporter.verify((error, success) => {
      if (success) {
        console.log('✅ SMTP Server is ready to take messages');
      } else {
        console.error('❌ SMTP Connection Error:', error);
      }
    });
  }

  async sendEmail(options: SendMailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: CONFIG.smtp.defaultFrom,
        ...options,
      });

      return info;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }
}

const mailService = new EmailService();

export default mailService;
