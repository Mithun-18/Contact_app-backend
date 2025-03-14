import { Router } from "express";
import {
  addContactsController,
  deleteContactController,
  getContactsController,
  updateContactController,
} from "../controller/contact.controller.js";

const router = Router();

router.route("/addContact").post(addContactsController);
router.route("/getAllContacts").get(getContactsController);
router.route("/updateContact").put(updateContactController);
router.route("/deleteContact").delete(deleteContactController);

export default router;
