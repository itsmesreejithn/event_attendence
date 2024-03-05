const express = require("express");
const trackerBlokcerController = require("../controllers/trackerBlockerRouter");

const router = express.Router();

router
  .route("/")
  .get(trackerBlokcerController.getAllTrackerBlocker)
  .post(trackerBlokcerController.createTrackerBlocker);
router
  .route("/:id")
  .get(trackerBlokcerController.getTrackerBlocker)
  .patch(trackerBlokcerController.updateTrackerBlocker)
  .delete(trackerBlokcerController.deleteTrackerBlocker);

module.exports = router;
