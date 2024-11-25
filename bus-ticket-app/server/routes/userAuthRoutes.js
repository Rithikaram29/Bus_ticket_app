const {Router} = require("express");
const router = Router();
const {userRegistration,userLogin} = require("../controllers/authenticationController")
const cors = require("cors")


router.use(cors())

router.post("/signup", userRegistration);
router.post("/login",userLogin );

module.exports = router;