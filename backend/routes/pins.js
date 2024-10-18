const router = require("express").Router();
const Pin = require("../models/Pin");

//create a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json({ message: "Create a new User", savedPin });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//get all pin
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    console.log("Pins from database:", pins); // Konsola yazdır
    res.status(200).json({ message: "All pins", result: pins.length, pins });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
