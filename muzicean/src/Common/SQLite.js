import { openDatabase } from 'react-native-sqlite-storage';

class SQLite {

    db = null;

    // provide all table listing here
    tableList  = [
        'CREATE TABLE IF NOT EXISTS users(user_id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50), firstname VARCHAR(50), lastname VARCHAR(50))',
    ]

    constructor(props) {
        if(global.db == null) {
            global.db = openDatabase("musiz.db", "1.0", "Muzicean DB", 200000, () => {
                console.log('DB opened successfully')
                this.tableList.forEach(element => {
                    this.db.transaction((txn) => {
                        txn.executeSql(element,[],(tx,res) => { console.log(res)});
                    });
                });
            }, () => {
                console.log("Cannot open db now");
            });
            this.db = global.db;
        } else {
            this.db = global.db;
        }
    }

    // run sql query
    query = (sql) => new Promise((resolve,reject) => {
        this.db.transaction((txn) => {
            txn.executeSql(sql,[],(tx,res) => { 
                resolve(res.rows)
            },(error) => {
                reject(error)
            });
        });
    });

    update = (sql,param) => new Promise((resolve,reject) => {
        this.db.transaction((txn) => {
            txn.executeSql(sql,param,(tx,res) => { 
                resolve(res.rows)
            },(error) => {
                reject(error)
            });
        });
    })

    delete = (sql,param = []) => new Promise((resolve,reject) => {
        this.db.transaction((txn) => {
            txn.executeSql(sql,param,(tx,res) => { 
                resolve(res.rows)
            },(error) => {
                reject(error)
            });
        });
    });

    insert = (tablname,fields) => new Promise((resolve,reject) => {
        console.log('Insert',global.db)
        this.db.transaction((txn) => {
            let fieldData = [];
            let values = [];
            for(index in fields) {
                fieldData.push(index);
                values.push(fields[index]);
            }
            let insertStmt = 'INSERT INTO ' + tablname + ' (' + fieldData.join(',') + ')';
            insertStmt += ' VALUES (\'' + values.join('\',\'') + '\')';
            txn.executeSql(insertStmt,[],(tx,res) => { 
                resolve(res)
            },(error) => {
                console.log(error);
                reject(error)
            });
        },(err) => {
            console.log(err);
        });
    });

}

export default SQLite;