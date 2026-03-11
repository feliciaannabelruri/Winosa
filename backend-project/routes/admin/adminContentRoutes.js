const express = require('express');
const router  = express.Router();
const ctrl    = require('../../controllers/admin/adminContentController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);

router.get('/team',            ctrl.getTeam);
router.post('/team',           ctrl.addMember);
router.patch('/team/reorder',  ctrl.reorderTeam);
router.put('/team/:id',        ctrl.updateMember);
router.delete('/team/:id',     ctrl.deleteMember);

router.get('/glass',  ctrl.getGlass);
router.put('/glass',  ctrl.updateGlass);

module.exports = router;