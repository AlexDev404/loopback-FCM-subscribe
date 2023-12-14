import {DataTypes} from 'sequelize';
import database from '../db';

const Topics = database.define('topics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
});

export default Topics;
