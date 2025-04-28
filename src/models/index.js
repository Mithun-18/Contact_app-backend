import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/index.js";

class Contacts extends Model {}

Contacts.init(
  {
    contactId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    nickName: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.DATE,
    },
    phoneNumbers: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    emails: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "Contacts",
  }
);

export { Contacts };
