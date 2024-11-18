const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Obter informações pessoais
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM personal_info');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;
