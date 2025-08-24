const router = require("express").Router();
const Controller = require("../controllers/auth");
const { checkValidObjectId } = require("../middlewares/validationMiddleware");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

router.route("/sign-in").post(Controller.signIn);

module.exports = router;
