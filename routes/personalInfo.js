const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// Obter todas as informações pessoais
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM personal_info");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Obter uma informação pessoal por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM personal_info WHERE id = $1",
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

// Criar nova informação pessoal
router.post("/", async (req, res) => {
  const { name, email, phone, address, summary, user_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO personal_info (name, email, phone, address, summary, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, phone, address, summary, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Atualizar informação pessoal por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, summary } = req.body;
  try {
    const result = await pool.query(
      "UPDATE personal_info SET name = $1, email = $2, phone = $3, address = $4, summary = $5 WHERE id = $6 RETURNING *",
      [name, email, phone, address, summary, id]
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

// Excluir informação pessoal por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM personal_info WHERE id = $1 RETURNING *",
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
