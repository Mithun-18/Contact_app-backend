import { connectionPool } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getContactsController = async (_, res) => {
  try {
    const connection = await connectionPool.getConnection();
    let sql = `SELECT 
    c.contact_id AS contactId, 
    c.first_name AS firstName, 
    c.last_name AS lastName, 
    c.nick_name AS nickName, 
    DATE_FORMAT(c.dob, '%Y-%m-%d') AS dob, 
    COALESCE(GROUP_CONCAT(DISTINCT p.phone_number ORDER BY p.id SEPARATOR ','), '') AS phoneNumbers,
    COALESCE(GROUP_CONCAT(DISTINCT e.email ORDER BY e.id SEPARATOR ','), '') AS emails
    FROM contacts c
    LEFT JOIN phone_number p ON c.contact_id = p.contact_id
    LEFT JOIN email e ON c.contact_id = e.contact_id
    GROUP BY c.contact_id;`;
    const queryResult = await connection.query(sql);
    connection.release();
    const [result] = queryResult;

    const contactList = result.map((con) => {
      con.phoneNumbers = con.phoneNumbers.split(",").map(Number);
      con.emails = con.emails.split(",");
      return con;
    });

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
    const connection = await connectionPool.getConnection();

    let sql = `INSERT INTO contacts(first_name,last_name,nick_name,dob) VALUES(?,?,?,?)`;
    const values = [
      contact.firstName,
      contact.lastName,
      contact.nickName,
      contact.dob,
    ];
    const queryReslut = await connection.query(sql, values);

    sql = `INSERT INTO phone_number(contact_id,phone_number) VALUES(${queryReslut[0].insertId},?)`;
    contact.phoneNumbers.map(async (ph) => await connection.query(sql, [ph]));

    sql = `INSERT INTO email(contact_id,email) VALUES(?,?)`;
    contact.emails.map(
      async (em) => await connection.query(sql, [queryReslut[0].insertId, em])
    );

    connection.release();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { contactId: queryReslut[0].insertId },
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
    const connection = await connectionPool.getConnection();
    let sql = `UPDATE contacts
             SET first_name=?, last_name=?, nick_name=?, dob=?
             WHERE contact_id=?
            `;
    const values = [
      contact.firstName,
      contact.lastName,
      contact.nickName,
      contact.dob,
      contact.contactId,
    ];

    await connection.query(sql, values);

    sql = `DELETE FROM phone_number where contact_id=?`;
    await connection.query(sql, [contact.contactId]);

    sql = `DELETE FROM email where contact_id=?`;
    await connection.query(sql, [contact.contactId]);

    sql = `INSERT INTO phone_number(contact_id,phone_number) VALUES(?,?)`;
    contact.phoneNumbers.map(
      async (ph) => await connection.query(sql, [contact.contactId, ph])
    );

    sql = `INSERT INTO email(contact_id,email) VALUES(?,?)`;
    contact.emails.map(
      async (em) => await connection.query(sql, [contact.contactId, em])
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
    const connection = await connectionPool.getConnection();
    let sql = `DELETE FROM contacts where contact_id=?`;
    await connection.query(sql, [contactId]);
    connection.release();

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
