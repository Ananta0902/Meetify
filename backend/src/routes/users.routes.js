import { Router } from "express";
import { addToHistory, getUserHistory, login,register} from "../controllers/user.controller.js";
const router=Router();

router.route("/login").post(login);
router.route("/register").post(register);;
// router.route("/add_to_activity").post(addToHistory);
// router.route("/add_to_activity").get(getUserHistory);

router.post("/add_to_activity",addToHistory);
router.get("/get_all_activity",getUserHistory);

export default router;