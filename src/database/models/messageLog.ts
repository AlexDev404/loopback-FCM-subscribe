import {DataTypes} from 'sequelize';
import database from '../db';

const Messages = database.define('messages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userGroup: {
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.STRING,
  },
});

export default Messages;
