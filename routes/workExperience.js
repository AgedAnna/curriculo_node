const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// Obter todas as experiências profissionais
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM work_experience ORDER BY start_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Obter uma experiência específica por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM work_experience WHERE id = $1",
      [id]
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

// Criar nova experiência profissional
router.post("/", async (req, res) => {
  const { company, position, start_date, end_date, responsibilities, user_id } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO work_experience (company, position, start_date, end_date, responsibilities,user_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company, position, start_date, end_date, responsibilities, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Atualizar experiência profissional por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { company, position, start_date, end_date, responsibilities } =
    req.body;
  try {
    const result = await pool.query(
      `UPDATE work_experience SET company = $1, position = $2, start_date = $3,
       end_date = $4, responsibilities = $5 WHERE id = $6 RETURNING *`,
      [company, position, start_date, end_date, responsibilities, id]
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

// Excluir experiência profissional por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM work_experience WHERE id = $1 RETURNING *",
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
