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
  },
  {
    sequelize,
    modelName: "Contacts",
  }
);

class PhoneNumber extends Model {}

PhoneNumber.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contactId: {
      type: DataTypes.INTEGER,
      references: {
        model: Contacts,
        key: "contactId",
      },
      onDelete: "CASCADE",
    },
    phoneNumber: {
      type: DataTypes.BIGINT(10),
    },
  },
  {
    sequelize,
    modelName: "PhoneNumbers",
  }
);

Contacts.hasMany(PhoneNumber, {
  foreignKey: "contactId",
  onDelete: "CASCADE",
});

PhoneNumber.belongsTo(Contacts, {
  foreignKey: "contactId",
});

class Email extends Model {}

Email.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contactId: {
      type: DataTypes.INTEGER,
      references: {
        model: Contacts,
        key: "contactId",
      },
      onDelete: "CASCADE",
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Emails",
  }
);

Contacts.hasMany(Email, {
  foreignKey: "contactId",
  onDelete: "CASCADE",
});

Email.belongsTo(Contacts, {
  foreignKey: "contactId",
});

export { Contacts, PhoneNumber, Email };
