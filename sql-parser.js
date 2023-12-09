
let database = {};
function sqlQuery(strSQL) {
    console.log("processing", strSQL);
    if (strSQL.indexOf("CREATE") !== -1) {
        console.log("sql identified as CREATE TABLE statement");
        return parseCreateTable(strSQL);
    }
    else if (strSQL.indexOf("SHOW") !== -1) {
        console.log("sql identified as SHOW TABLES statement");
        return parseShowTables(strSQL);
    }
    else if (strSQL.indexOf("DESCRIBE") !== -1) {
        console.log("sql identified as DESCRIBE table statement");
        return parseDescribeTable(strSQL);
    }
    else if (strSQL.indexOf("DROP") !== -1) {
        console.log("sql identified as DROP table statement");
        return parseDropTable(strSQL);
    }
    delete object[property]
}

function parseDropTable(strSQL){
    let tableName=strSQL.replace("DROP","").replace("TABLE","").trim()
    delete database[tableName];
    return database[tableName];
}

function parseCreateTable(strSQL) {
    // CREATE TABLE table_name (column1 datatype, column2 datatype, column3 datatype...);
    console.log("parsing", strSQL);
    let thisTable = {};
    thisTable["headers"] = [];
    thisTable["headers"].push("PRIMARY_KEY");
    thisTable["data-types"] = {};
    thisTable["data-types"]["PRIMARY_KEY"] = "NUMBER";
    thisTable["NEXT_PRIMARY_KEY"] = 0;
    //get name
    let name = strSQL.match(/TABLE.*\(/g)[0].replace("TABLE", "").replace("(", "").trim();
    thisTable["name"] = name;
    //get column data-type pairs
    let strPairs = strSQL.match(/\(.*\)/g)[0].replace("(", "").replace(")", "").trim().split(",");
    //separate column names (headers) and data types
    for (let i = 0; i < strPairs.length; i++) {
        strPairs[i] = strPairs[i].trim();
        let tokens = strPairs[i].split(" ");
        let dataType = tokens.pop();//last item is data type, get and remove
        let columnName = tokens.join(" ").trim(); //join remaining
        thisTable["headers"].push(columnName);
        thisTable["data-types"][columnName] = dataType;
    }
    thisTable["data"] = [];
    database[name] = thisTable;
    return thisTable;
}





function parseDescribeTable(strSQL) {
    // DESCRIBE city;
    // +------------+----------+------+-----+---------+----------------+
    // | Field      | Type     | Null | Key | Default | Extra          |
    // +------------+----------+------+-----+---------+----------------+
    // | Id         | int(11)  | NO   | PRI | NULL    | auto_increment |
    // | Name       | char(35) | YES  |     | NULL    |                |
    // | Country    | char(3)  | NO   | UNI |         |                |
    // | District   | char(20) | YES  | MUL |         |                |
    // | Population | int(11)  | YES  |     | NULL    |                |
    // +------------+----------+------+-----+---------+----------------+
    let tableName = strSQL.replace("DESCRIBE", "").trim();
    let tableToDescribe = database[tableName];
    let thisTable = {};
    thisTable["name"] = strSQL;
    thisTable["headers"] = ["Field", "Type"];
    thisTable["data-types"] = {};
    thisTable["data-types"]["Field"] = "STRING";
    thisTable["data-types"]["Type"] = "STRING";
    thisTable["data"] = [];
    let tableHeaders=tableToDescribe["headers"];
    let tableDataTypes=tableToDescribe["data-types"];
    for (let i = 0; i < tableHeaders.length;i++){
        let tempRow={};
        tempRow["Field"]=tableHeaders[i];
        tempRow["Type"]=tableDataTypes[tableHeaders[i]];
        thisTable["data"].push(tempRow);
    }
    thisTable["NEXT_PRIMARY_KEY"]=-1;
    return thisTable;

}


function parseShowTables(strSQL) {
    // CREATE TABLE table_name (column1 datatype, column2 datatype, column3 datatype...);
    //let tempTable=sqlQuery("CREATE TABLE tables (name STRING)");
    let tempTable = {};
    tempTable["name"] = strSQL;
    tempTable["headers"] = ['name'];
    tempTable["data-types"] = { "name": "STRING" };
    tempTable["data"] = [];
    let tableNames = Object.keys(database);
    //loop through all tables
    // let keys=database.keys;
    for (let i = 0; i < tableNames.length; i++) {
        let tempRow = {};
        tempRow["name"] = tableNames[i];
        tempTable["data"].push(tempRow);
    }
    tempTable["NEXT_PRIMARY_KEY"]=-1;
    return tempTable;
}

console.log(sqlQuery("CREATE TABLE people (first_name STRING, last_name STRING, Age NUMBER);"));
console.log(sqlQuery("CREATE TABLE pets (name STRING, type STRING, age NUMBER, sex STRING);"));
console.log(database);

console.log(sqlQuery("SHOW TABLES"));
console.log(sqlQuery("DESCRIBE pets"));
console.log("------------------/n------------------");
console.log(database);
sqlQuery("DROP TABLE people");
console.log("------------------/n------------------");
console.log(database);

// Available SQL statements:
// -----------------------------
// NAME DATABASE `myDatabaseName`;omitting
// CREATE TABLE table_name (column1 datatype, column2 datatype, column3 datatype...);   ///////DONE///////
// SHOW TABLES;                                                                         ///////DONE///////            
// DESCRIBE table_name;                                                                 ///////DONE///////
// DROP TABLE table_name;                                                               ///////DONE///////
// ALTER TABLE table_name ADD column_name datatype;
// ALTER TABLE table_name DROP COLUMN column_name;
// ALTER TABLE table_name CHANGE samename samename newdatatype;
// ALTER TABLE table_name CHANGE oldname newname samedatatype:
// ALTER TABLE table_name CHANGE oldname newname newdatatype;
// INSERT INTO table_name (column1, column2, column3, ...) VALUES (`value1`, `value2`, `value3`, ...);
// UPDATE table_name SET column1 = `value1`, column2 = `value2`, ... WHERE condition;
// DELETE FROM table_name WHERE condition;
// SELECT * FROM table_name;
// SELECT column1, column2, ...FROM table_name;
// SELECT column1, column2, ... FROM table_name WHERE condition;
// SELECT column1, column2, ... FROM table_name ORDER BY column ASC|DESC;
// SELECT column1, column2, ... FROM table1 INNER JOIN table2 ON table1.column_name = table2.column_name;
// INSERT INTO newtable [a SELECT statement];
// HELP
// INNER, JOIN, SELECT, INSERT, INTO, UPDATE, DELETE, CREATE, DROP, TABLE, SHOW, TABLES, DESCRIBE, HELP, SET,
// WHERE, VALUES, ON, PRIMARY_KEY, NEXT_PRIMARY_KEY, _METADATA, STRING, NUMBER,
// =, !=, <>, >=, <=, >, <, * `(back ticks), NOLOCIMES, ERROR

//  Example Database Structure
// let database = {
//     "Table1":
//     {
//         "name": "Table1",
//         "headers": ["PRIMARY_KEY", "Column 1", "Column 2", "Column 3"],
//         "data-type": { "PRIMARY_KEY": "NUMBER", "Column 1": "STRING", "Column 2": "NUMBER", "Column 3": "STRING" },
//         "data": [
//             { "PRIMARY_KEY": 0, "Column 1": "", "Column 2": "", "Column 3": "" },
//             { "PRIMARY_KEY": 1, "Column 1": "", "Column 2": "", "Column 3": "" },
//             { "PRIMARY_KEY": 2, "Column 1": "", "Column 2": "", "Column 3": "" }
//         ],
//         "NEXT_PRIMARY_KEY": 3
//     },
//     "Table2":
//     {
//         "name": "Table2",
//         "headers": ["PRIMARY_KEY", "Column 1", "Column 2", "Column 3"],
//         "data-type": { "PRIMARY_KEY": "NUMBER", "Column 1": "STRING", "Column 2": "NUMBER", "Column 3": "STRING" },
//         "data": [
//             { "PRIMARY_KEY": 0, "Column 1": "", "Column 2": "", "Column 3": "" },
//             { "PRIMARY_KEY": 1, "Column 1": "", "Column 2": "", "Column 3": "" },
//             { "PRIMARY_KEY": 2, "Column 1": "", "Column 2": "", "Column 3": "" }
//         ],
//         "NEXT_PRIMARY_KEY": 3
//     }
// }
//
// Notes:
// the order is very important
// <>
// !=
// >=
// >
// <=
// <
// =

function parseInsertInto(strSQL) {
    // INSERT INTO table_name (column1, column2, column3, ...) VALUES (`value1`, `value2`, `value3`, ...);
    // get table name
    let name=/(INTO)(.*?)(\()/.exec(strSQL)[2].trim();
    console.log(name);
    // get values
    let valuesString=/(VALUES.*?)(\({1})(.*)(\){1})/.exec(strSQL)[3];
    console.log(valuesString);
    // get 
    `\s*,\s*`
}

parseInsertInto("INSERT INTO table_name (column1, column2, column3, ...) VALUES (`value1`, `value2`, `value3`, ...);");

let strSQL="INSERT INTO table_name (column1, column2, column3, ...) VALUES (`value1`, `value2`, `value3`, ...);";
console.log(getMatches(strSQL,/(VALUES.*?)(\({1})(.*)(\){1})/g,3));
