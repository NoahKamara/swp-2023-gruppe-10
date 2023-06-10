import { Sequelize } from 'sequelize';



export const initDatabase = async (sequelize: Sequelize):Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};


