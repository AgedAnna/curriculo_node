const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Obter todas as formações acadêmicas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM education ORDER BY start_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;
