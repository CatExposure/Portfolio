const oracledb = require('oracledb');
require('dotenv').config();

async function dbConnect(){
    let connect;

    try {
        connect = await oracledb.getConnection( {
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: process.env.CONNECTSTRING
        });
    } catch (err) {
        console.log(err)
    } finally {
        if (connect) {
            console.log("connection successful!")
        } else {
            console.log("connection unsuccessful :(")
        }
    }
}

dbConnect();