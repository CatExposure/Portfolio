const oracledb = require('oracledb');

async function dbConnect(){
    let connect;

    try {
        connect = await oracledb.getConnection( {
            user: "ADMIN",
            password: "Megumin5656!",
            connectString: "(description= (retry_count=2)(retry_delay=2)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=gf0f94ceafe056c_sqlportfolio_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
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