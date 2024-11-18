const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// Obter todas as formações acadêmicas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM education ORDER BY start_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Obter uma formação específica por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM education WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Criar nova formação acadêmica
router.post("/", async (req, res) => {
  const {
    institution,
    degree,
    field_of_study,
    start_date,
    end_date,
    grade,
    description,
    user_id,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO education (institution, degree, field_of_study, start_date, end_date, grade, description, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        institution,
        degree,
        field_of_study,
        start_date,
        end_date,
        grade,
        description,
        user_id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Atualizar formação acadêmica por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    institution,
    degree,
    field_of_study,
    start_date,
    end_date,
    grade,
    description,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE education SET institution = $1, degree = $2, field_of_study = $3, start_date = $4,
       end_date = $5, grade = $6, description = $7 WHERE id = $8 RETURNING *`,
      [
        institution,
        degree,
        field_of_study,
        start_date,
        end_date,
        grade,
        description,
        id,
      ]
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

// Excluir formação acadêmica por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM education WHERE id = $1 RETURNING *",
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
