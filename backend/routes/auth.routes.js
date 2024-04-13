"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de autenticación */
const authController = require("../controllers/auth.controller");

/** Instancia del enrutador */
const router = express.Router();

// Define las rutas para la autenticación
router.post("/login", authController.login);
router.post("/loginSol", authController.login);
router.post("/logout", authController.logout);
router.get("/refresh", authController.refresh);

// Exporta el enrutador
module.exports = router;