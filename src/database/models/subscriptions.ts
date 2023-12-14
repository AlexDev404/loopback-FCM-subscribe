import {DataTypes} from 'sequelize';
import database from '../db';

const UserGroup = database.define('subscriptions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user: {
    type: DataTypes.STRING,
  },
  topic: {
    type: DataTypes.INTEGER,
  },
});

export default UserGroup;
