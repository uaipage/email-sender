require("dotenv").config();
const nodemailer = require("nodemailer");

// Configuração do transporte SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true para 465, false para outros
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Função para enviar e-mail
async function sendMail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"Meu App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: `<p>${text}</p>`
    });

    console.log(`E-mail enviado: ${info.messageId}`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail: ${error}`);
  }
}

// Exemplo de envio
sendMail(
  "gabrielmillersilone@gmail.com",
  "Teste de E-mail",
  "Olá! Este é um teste."
);
