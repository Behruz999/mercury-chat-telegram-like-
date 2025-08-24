const router = require("express").Router();
const Controller = require("../controllers/messageController");
const { checkValidObjectId } = require("../middlewares/validationMiddleware");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

router.route("/").post(Controller.addOne);

router.route("/").get(Controller.getAll);

router.route("/:id").get(checkValidObjectId, Controller.getOne);

router.route("/:id").put(checkValidObjectId, Controller.editOne);

router.route("/:id").delete(checkValidObjectId, Controller.deleteOne);

module.exports = router;
