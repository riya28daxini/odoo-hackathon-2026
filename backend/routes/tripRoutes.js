import express from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  addSection,
  removeSection,
  addActivity,
  removeActivity,
  reorderActivities
} from '../controllers/tripController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getTrips);
router.get('/:id', getTripById);
router.post('/', optionalAuth, createTrip);
router.put('/:id', optionalAuth, updateTrip);
router.delete('/:id', optionalAuth, deleteTrip);

router.post('/:id/sections', addSection);
router.delete('/:id/sections/:sectionId', removeSection);

router.post('/:id/sections/:sectionId/activities', addActivity);
router.delete('/:id/sections/:sectionId/activities/:activityId', removeActivity);
router.put('/:id/sections/reorder', reorderActivities);

export default router;
