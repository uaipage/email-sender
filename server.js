require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Envio de E-mails",
      version: "1.0.0",
      description: "API para envio de e-mails usando Node.js e Nodemailer."
    }
  },
  apis: ["./server.js"]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /send-email:
 *   post:
 *     summary: Envia um e-mail
 *     description: Rota para envio de e-mails.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - message
 *             properties:
 *               to:
 *                 type: string
 *                 example: "destinatario@email.com"
 *               subject:
 *                 type: string
 *                 example: "Teste de E-mail"
 *               message:
 *                 type: string
 *                 example: "Olá, isso é um teste!"
 *     responses:
 *       200:
 *         description: E-mail enviado com sucesso.
 *       400:
 *         description: Campos obrigatórios ausentes.
 *       500:
 *         description: Erro ao enviar o e-mail.
 */
app.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const info = await transporter.sendMail({
      from: `"Meu App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`
    });

    console.log(`E-mail enviado: ${info.messageId}`);
    res
      .status(200)
      .json({ success: true, message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error(`Erro ao enviar e-mail: ${error}`);
    res.status(500).json({ success: false, error: "Erro ao enviar o e-mail." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(
    `📄 Documentação disponível em http://localhost:${PORT}/api-docs`
  );
});
