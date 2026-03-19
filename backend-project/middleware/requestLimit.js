const express = require('express');

// Limit ketat untuk endpoint publik yang tidak butuh payload besar
exports.strictLimit = express.json({ limit: '50kb' });
exports.strictUrlEncoded = express.urlencoded({ extended: true, limit: '50kb' });

// Limit medium untuk form biasa (contact, newsletter, auth)
exports.mediumLimit = express.json({ limit: '200kb' });
exports.mediumUrlEncoded = express.urlencoded({ extended: true, limit: '200kb' });

// Limit besar hanya untuk upload (blog content, portfolio description)
exports.largeLimit = express.json({ limit: '2mb' });
exports.largeUrlEncoded = express.urlencoded({ extended: true, limit: '2mb' });