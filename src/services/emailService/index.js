import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
	host: 'aws:443',
	port: '2324',
	secure: true,
	auth: {
		user: 'xysb',
		pass: 'xyz@123'
	}
});

	transport
		.verify()
		.then(() => console.log('Connected to email server'))
		.catch(() => console.log('Unable to connect to email server'));

export const sendEmail = async (to, subject, html) => {
	const msg = { from: 'xyz@gmail.com', to, subject, html };
	await transport.sendMail(msg);
};

export const sendResetPasswordEmail = async (to, token) => {
	const subject = 'Reset password';
	const html = 'html xyz';
	await sendEmail(to, subject, html);
};