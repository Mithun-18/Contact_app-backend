import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Contacts, Email, PhoneNumber } from "../models/index.js";
import { sequelize } from "../db/index.js";

const getContactsController = async (_, res) => {
  try {
    const contacts = await Contacts.findAll({
      include: [
        {
          model: PhoneNumber,
          attributes: ["phoneNumber"],
        },
        {
          model: Email,
          attributes: ["email"],
        },
      ],
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
      phoneNumbers: con.PhoneNumbers.map((p) => p.phoneNumber),
      emails: con.Emails.map((e) => e.email),
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
    });

    contact.phoneNumbers.map(
      async (ph) =>
        await PhoneNumber.create({
          contactId: con.contactId,
          phoneNumber: ph,
        })
    );

    contact.emails.map(
      async (em) =>
        await Email.create({
          contactId: con.contactId,
          email: em,
        })
    );

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
    });

    await PhoneNumber.destroy({
      where: {
        contactId: contact.contactId,
      },
    });

    await Email.destroy({
      where: {
        contactId: contact.contactId,
      },
    });

    contact.phoneNumbers.map(
      async (ph) =>
        await PhoneNumber.create({
          contactId: contact.contactId,
          phoneNumber: ph,
        })
    );

    contact.emails.map(
      async (em) =>
        await Email.create({
          contactId: contact.contactId,
          email: em,
        })
    );

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
