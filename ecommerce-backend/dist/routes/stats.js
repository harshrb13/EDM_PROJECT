import express from 'express';
import { getBarChart, getDashboardStats, getLineChart, getPieCharts } from '../controllers/stats.js';
import { adminOnly } from '../middlewares/auth.js';
const router = express.Router();
router.get("/stats", adminOnly, getDashboardStats);
router.get("/pie", adminOnly, getPieCharts);
router.get("/bar", adminOnly, getBarChart);
router.get("/line", adminOnly, getLineChart);
export default router;
