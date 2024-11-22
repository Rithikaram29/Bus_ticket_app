const {Router} = require("express");
const router = Router();
const {userRegistration,userLogin} = require("./controllers/userLogin")

router.post("/signin", userRegistration);
router.post("/login",userLogin );