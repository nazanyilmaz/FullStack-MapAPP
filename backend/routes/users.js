const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verilerin eksik olup olmadığını kontrol edin
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcıyı oluştur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Kullanıcıyı kaydet
    const user = await newUser.save();

    // Yanıt gönder
    res.status(201).json({ message: "User is Created", user: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    //find user
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("wrong username or password!!");
    //validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong username or password!!");
    //sent response
    res
      .status(200)
      .json({
        message: "User is logined",
        _id: user._id,
        username: user.username,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;
