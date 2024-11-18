const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares
app.use(cors());
app.use(express.json());

// Importar Rotas
const personalInfoRouter = require('./routes/personalInfo');
const educationRouter = require('./routes/education');
const workExperienceRouter = require('./routes/workExperience');
const skillsRouter = require('./routes/skills');

// Usar Rotas
app.use('/api/personal-info', personalInfoRouter);
app.use('/api/education', educationRouter);
app.use('/api/work-experience', workExperienceRouter);
app.use('/api/skills', skillsRouter);

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
