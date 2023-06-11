import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres://adminin:CHOOSE_A_Password@localhost:5342/postgres');

const initDb = async ( ) => {
    try{
        await sequelize.authenticate;
        console.log('sucess');
    } catch (error){
        console.log(console.error(error)
        );
    }
};
initDb();