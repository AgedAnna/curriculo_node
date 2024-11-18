const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// Obter todas as habilidades
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM skills ORDER BY proficiency_level DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Obter uma habilidade específica por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM skills WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Criar nova habilidade
router.post("/", async (req, res) => {
  const { skill_name, proficiency_level, user_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO skills (skill_name, proficiency_level, user_id) VALUES ($1, $2, $3) RETURNING *",
      [skill_name, proficiency_level, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Atualizar habilidade por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { skill_name, proficiency_level } = req.body;
  try {
    const result = await pool.query(
      "UPDATE skills SET skill_name = $1, proficiency_level = $2 WHERE id = $3 RETURNING *",
      [skill_name, proficiency_level, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Excluir habilidade por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM skills WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }
    res.json({ message: "Registro excluído com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
