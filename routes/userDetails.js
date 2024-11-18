// routes/userDetails.js
const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// Obter todos os detalhes do usuário
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Obter informações pessoais
    const personalInfoPromise = pool.query(
      "SELECT * FROM personal_info WHERE user_id = $1",
      [userId]
    );

    // Obter educação
    const educationPromise = pool.query(
      "SELECT * FROM education WHERE user_id = $1 ORDER BY start_date DESC",
      [userId]
    );

    // Obter experiência profissional
    const workExperiencePromise = pool.query(
      "SELECT * FROM work_experience WHERE user_id = $1 ORDER BY start_date DESC",
      [userId]
    );

    // Obter habilidades
    const skillsPromise = pool.query(
      "SELECT * FROM skills WHERE user_id = $1 ORDER BY proficiency_level DESC",
      [userId]
    );

    // Executar todas as promessas em paralelo
    const [
      personalInfoResult,
      educationResult,
      workExperienceResult,
      skillsResult,
    ] = await Promise.all([
      personalInfoPromise,
      educationPromise,
      workExperiencePromise,
      skillsPromise,
    ]);

    // Montar o objeto de resposta
    const userDetails = {
      personalInfo: personalInfoResult.rows[0] || {},
      education: educationResult.rows,
      workExperience: workExperienceResult.rows,
      skills: skillsResult.rows,
    };

    res.json(userDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
