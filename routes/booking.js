const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingLeaveById,
  accessBookingByUser,
  getBooking,
  getBookingLeaveByvnpayId,
  getBookingLeaveByuserId,
  calculateHotelRevenue,
  updateBooking,
  stepStatus,
} = require("../controllers/booking.controller.js");

router.put("/update-status/:leaseId", stepStatus);
router.put("/:id", updateBooking);

router.post("/create", createBooking);
router.get("", getBooking);
router.get("/report/hotel/revenue", calculateHotelRevenue);

router.post("/accessBooking", accessBookingByUser);
// router.post("/:id", BookingController.getOne)
router.get("/find/:leaseId", getBookingLeaveById);
router.get("/infor/:vnpayId", getBookingLeaveByvnpayId);
router.get("/user/:userId", getBookingLeaveByuserId);

module.exports = router;
