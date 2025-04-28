import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Contacts } from "../models/index.js";
import { sequelize } from "../db/index.js";

const getContactsController = async (_, res) => {
  try {
    const contacts = await Contacts.findAll({
      attributes: {
        include: [
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("dob"), "%Y-%m-%d"),
            "dob",
          ],
        ],
        exclude: ["dob"],
      },
    });

    const contactList = contacts.map((con) => ({
      contactId: con.contactId,
      firstName: con.firstName,
      lastName: con.lastName,
      nickName: con.nickName,
      dob: con.dob,
      phoneNumbers: con.phoneNumbers ? JSON.parse(con.phoneNumbers) : [],
      emails: con.emails ? JSON.parse(con.emails) : [],
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, contactList, "Fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.responce));
  }
};

const addContactsController = async (req, res) => {
  const { contact } = req.body;

  try {
    const con = await Contacts.create({
      firstName: contact.firstName,
      lastName: contact.lastName,
      nickName: contact.nickName,
      dob: contact.dob,
      phoneNumbers: contact.phoneNumbers,
      emails: contact.emails,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { contactId: con.contactId },
          "inserted successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.responce));
  }
};

const updateContactController = async (req, res) => {
  const { contact } = req.body;
  try {
    const con = await Contacts.findByPk(contact.contactId);

    con.update({
      firstName: contact.firstName,
      lastName: contact.lastName,
      nickName: contact.nickName,
      dob: contact.dob,
      phoneNumbers: contact.phoneNumbers,
      emails: contact.emails,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { contactId: contact.contactId },
          "updated successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.responce));
  }
};

const deleteContactController = async (req, res) => {
  const { contactId } = req.query;
  try {
    await Contacts.destroy({
      where: {
        contactId: contactId,
      },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { contactId: contactId }, "deleted successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.responce));
  }
};

export {
  addContactsController,
  deleteContactController,
  getContactsController,
  updateContactController,
};
