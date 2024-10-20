
//Example Database Structure
let database=
  {
    "tables":{
        "owners": {
            "NEXT_PRIMARY_KEY": 3,
            "DATA": [
                {"PRIMARY_KEY": 0,"first": "john","last": "doe","age": 40},
                {"PRIMARY_KEY": 1,"first": "jane","last": "doe","age": 38},
                {"PRIMARY_KEY": 2,"first": "kid","last": "doe","age": 10}
            ],
            "HEADERS": ["PRIMARY_KEY","first","last","age"],
            "DATA_TYPES": {"PRIMARY_KEY": "NUMBER","first": "STRING","last": "STRING","age": "NUMBER"}
        },
        "pets": {
            "NEXT_PRIMARY_KEY": 2,
            "DATA": [
                {"PRIMARY_KEY": 0,"name": "fido","type": "dog","age": 4},
                {"PRIMARY_KEY": 1,"name": "fuzzy","type": "cat","age": 3}
            ],
            "HEADERS": ["PRIMARY_KEY","name","type","age"],
            "DATA_TYPES": {"PRIMARY_KEY": "NUMBER","name": "STRING","type": "STRING","age": "NUMBER"}
        }
    }
}


function sqlQuery(strSQL) {
    console.log("processing", strSQL);
    strSQL=strSQL.split(";").join("").trim();
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
    else if ((strSQL.indexOf("DROP") !== -1)&&(strSQL.indexOf("TABLE") !== -1)&&(strSQL.indexOf("ALTER")===-1)){
        console.log("sql identified as DROP table statement");
        return parseDropTable(strSQL);
    }
    else if((strSQL.indexOf("INSERT") !== -1)&&(strSQL.indexOf("INTO") !== -1)&&(strSQL.indexOf("SELECT") === -1)){
        console.log("sql identified as INSERT INTO statement");
        return parseInsertInto(strSQL);
    }
    else if((strSQL.indexOf("ALTER") !== -1)&&(strSQL.indexOf("TABLE") !== -1)&&(strSQL.indexOf("ADD") !== -1)){
        console.log("sql identified as ALTER TABLE ADD statement");
        return parseAlterTableAdd(strSQL);
    }
    else if((strSQL.indexOf("DROP") !== -1)&&(strSQL.indexOf("COLUMN") !== -1)){
        console.log("sql identified as ALTER TABLE DROP COLUMN statement");
        return parseDropColumn(strSQL);
    }
}

function parseDropTable(strSQL){
    let tablename=strSQL.replace("DROP","").replace("TABLE","").trim()
    delete database["tables"][tablename];
    return database["tables"][tablename];
}

function parseCreateTable(strSQL) {
    // CREATE TABLE table_name (column1 datatype, column2 datatype, column3 datatype...);
    console.log("parsing", strSQL);
    let thisTable = {};
    thisTable["HEADERS"] = [];
    thisTable["HEADERS"].push("PRIMARY_KEY");
    thisTable["DATA_TYPES"] = {};
    thisTable["DATA_TYPES"]["PRIMARY_KEY"] = "NUMBER";
    thisTable["NEXT_PRIMARY_KEY"] = 0;
    //get name
    let name = strSQL.match(/TABLE.*\(/g)[0].replace("TABLE", "").replace("(", "").trim();
    thisTable["name"] = name;
    //get column DATA_TYPE pairs
    let strPairs = strSQL.match(/\(.*\)/g)[0].replace("(", "").replace(")", "").trim().split(",");
    //separate column names (HEADERS) and DATA types
    for (let i = 0; i < strPairs.length; i++) {
        strPairs[i] = strPairs[i].trim();
        let tokens = strPairs[i].split(" ");
        let datatype = tokens.pop();//last item is DATA type, get and remove
        let columnname = tokens.join(" ").trim(); //join remaining
        thisTable["HEADERS"].push(columnname);
        thisTable["DATA_TYPES"][columnname] = datatype;
    }
    thisTable["DATA"] = [];
    database["tables"][name]=thisTable;
    //database[name] = thisTable;
    return thisTable;
}


function parseDescribeTable(strSQL) {
    // DESCRIBE city;
    // +------------+----------+------+-----+---------+----------------+
    // | Field      | Type     | Null | Key | Default | Extra          |
    // +------------+----------+------+-----+---------+----------------+
    // | Id         | int(11)  | NO   | PRI | NULL    | auto_increment |
    // | name       | char(35) | YES  |     | NULL    |                |
    // | Country    | char(3)  | NO   | UNI |         |                |
    // | District   | char(20) | YES  | MUL |         |                |
    // | Population | int(11)  | YES  |     | NULL    |                |
    // +------------+----------+------+-----+---------+----------------+
    let tablename = strSQL.replace("DESCRIBE", "").trim();
    let tableToDescribe = database["tables"][tablename];
    let thisTable = {};
    thisTable["name"] = strSQL;
    thisTable["HEADERS"] = ["Field", "Type"];
    thisTable["DATA_TYPES"] = {};
    thisTable["DATA_TYPES"]["Field"] = "STRING";
    thisTable["DATA_TYPES"]["Type"] = "STRING";
    thisTable["DATA"] = [];
    let tableHeaders=tableToDescribe["HEADERS"];
    let tableDataTypes=tableToDescribe["DATA_TYPES"];
    for (let i = 0; i < tableHeaders.length;i++){
        let tempRow={};
        tempRow["Field"]=tableHeaders[i];
        tempRow["Type"]=tableDataTypes[tableHeaders[i]];
        thisTable["DATA"].push(tempRow);
    }
    thisTable["NEXT_PRIMARY_KEY"]=-1;
    return thisTable;

}


function parseShowTables(strSQL) {
    // CREATE TABLE table_name (column1 datatype, column2 datatype, column3 datatype...);
    //let tempTable=sqlQuery("CREATE TABLE tables (name STRING)");
    let tempTable = {};
    tempTable["name"] = strSQL;
    tempTable["HEADERS"] = ['name'];
    tempTable["DATA_TYPES"] = { "name": "STRING" };
    tempTable["DATA"] = [];
    let tablenames = Object.keys(database["tables"]);
    //loop through all tables
    // let keys=database.keys;
    for (let i = 0; i < tablenames.length; i++) {
        let tempRow = {};
        tempRow["name"] = tablenames[i];
        tempTable["DATA"].push(tempRow);
    }
    tempTable["NEXT_PRIMARY_KEY"]=-1;
    return tempTable;
}

/*
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
*/
// Available SQL statements:
// -----------------------------
// name DATABASE `myDatabasename`;omitting
// CREATE TABLE table_name (column1 datatype, column2 datatype, column3 datatype...);   ///////DONE///////
// SHOW TABLES;                                                                         ///////DONE///////            
// DESCRIBE table_name;                                                                 ///////DONE///////
// DROP TABLE table_name;                                                               ///////DONE///////
// ALTER TABLE table_name ADD column_name datatype;                                     ///////DONE///////
// ALTER TABLE table_name DROP COLUMN column_name;                                      ///////DONE///////

// ALTER TABLE table_name CHANGE samename samename newdatatype;
// ALTER TABLE table_name CHANGE oldname newname samedatatype:
// ALTER TABLE table_name CHANGE oldname newname newdatatype;

// INSERT INTO table_name (column1, column2, column3, ...) VALUES (`value1`, `value2`, `value3`, ...); ///////DONE///////

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
//         "HEADERS": ["PRIMARY_KEY", "Column 1", "Column 2", "Column 3"],
//         "DATA_TYPE": { "PRIMARY_KEY": "NUMBER", "Column 1": "STRING", "Column 2": "NUMBER", "Column 3": "STRING" },
//         "DATA": [
//             { "PRIMARY_KEY": 0, "Column 1": "", "Column 2": "", "Column 3": "" },
//             { "PRIMARY_KEY": 1, "Column 1": "", "Column 2": "", "Column 3": "" },
//             { "PRIMARY_KEY": 2, "Column 1": "", "Column 2": "", "Column 3": "" }
//         ],
//         "NEXT_PRIMARY_KEY": 3
//     },
//     "Table2":
//     {
//         "name": "Table2",
//         "HEADERS": ["PRIMARY_KEY", "Column 1", "Column 2", "Column 3"],
//         "DATA_TYPE": { "PRIMARY_KEY": "NUMBER", "Column 1": "STRING", "Column 2": "NUMBER", "Column 3": "STRING" },
//         "DATA": [
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

    // get table
    let thisTable=database["tables"][name];
    let NEXT_PRIMARY_KEY=thisTable["NEXT_PRIMARY_KEY"];

    // get values
    let valuesString=/(VALUES.*?)(\({1})(.*)(\){1})/.exec(strSQL)[3];

    // get columns
    let columnsString=/\((.*)\)(\s*VALUES)/.exec(strSQL)[1];

    //get key/value pairs
    let keys=columnsString.split(",");
    for (let i=0;i<keys.length;i++){
        keys[i]=keys[i].trim();
    }
    let values=valuesString.split(",");
    for (let i=0;i<values.length;i++){
        values[i]=values[i].trim().split("`").join("");
    }

    //change the values to the correct datatype
    let dataTypes=thisTable["DATA_TYPES"];
    for (let i=0;i<values.length;i++){
        //get datatype
        let type=dataTypes[keys[i]];
        if (type==="NUMBER"){
            values[i]=Number(values[i]);
        }
        else if (type==="STRING"){
            values[i]=values[i].toString();
        }
        else {
            values[i]=values[i].toString();
        }
    }

    //insert values into table
    let row={};
    row["PRIMARY_KEY"]=NEXT_PRIMARY_KEY;
    for (let i=0;i<keys.length;i++){
        row[keys[i]]=values[i];
    }
    thisTable["DATA"].push(row);
    thisTable["NEXT_PRIMARY_KEY"]=Number(NEXT_PRIMARY_KEY)+1;
    
    console.log(thisTable);
    return thisTable;

}


// ALTER TABLE table_name ADD column_name datatype;

function parseAlterTableAdd(strSQL){
    let tableName=/ALTER\s*TABLE\s*(.*)ADD\s*/.exec(strSQL)[1].trim();
    console.log(tableName);
    let thisRegex = /ADD\s*(.*)\s(.*)/.exec(strSQL);
    let columnName=thisRegex[1].trim();
    let dataType=thisRegex[2].trim();
    console.log(columnName,dataType);
    let thisTable=database["tables"][tableName];

    /*
    "NEXT_PRIMARY_KEY": "2",
    "DATA": [
        {"PRIMARY_KEY": "0","name": "fido","type": "dog","age": 4},
        {"PRIMARY_KEY": "1","name": "fuzzy","type": "cat","age": 3}
    ],
    "HEADERS": ["PRIMARY_KEY","name","type","age"],
    "DATA_TYPES": {"PRIMARY_KEY": "NUMBER","name": "STRING","type": "STRING","age": "NUMBER"}
    */
    
    //add to headers and datatypes

    thisTable["HEADERS"].push(columnName);
    thisTable["DATA_TYPES"][columnName]=dataType;

    console.log(thisTable);
    return(thisTable);

    //add 

}

//ALTER TABLE table_name DROP COLUMN column_name;
function parseDropColumn(strSQL){
    let tableName=/TABLE\s*(.*)\s*DROP/.exec(strSQL)[1].trim();
    let columnName=/COLUMN\s*(.*)/.exec(strSQL)[1].trim();
    console.log(tableName);
    console.log(columnName);

    let thisTable=database["tables"][tableName];
    console.log(thisTable);

    //remove from DATA_TYPES
    delete thisTable["DATA_TYPES"][columnName];

    //remove from HEADERS
    let headers=thisTable["HEADERS"]
    let index = headers.indexOf(columnName);
    if (index !== -1) {
        headers.splice(index, 1);
    }

    //console.log(thisTable);

    //remove from each row

    let data=thisTable["DATA"];

    for (let i=0;i<data.length;i++){
        delete data[i][columnName];
    }
    console.log(thisTable);
}

let strSQL="INSERT INTO pets (name, type, age) VALUES (`bob`, `sponge`, `16`);";
sqlQuery(strSQL);
strSQL="ALTER TABLE pets ADD sex STRING";
sqlQuery(strSQL);
strSQL="INSERT INTO pets (name, type,sex,age) VALUES (`sandy`, `squirrel`,'female`,`15`);";
sqlQuery(strSQL);
//console.log(parseInsertInto(strSQL));
//console.log(getMatches(strSQL,/(VALUES.*?)(\({1})(.*)(\){1})/g,3));
sqlQuery("ALTER TABLE pets DROP COLUMN sex");
//sqlQuery(strSQL);

console.log(sqlQuery("DESCRIBE pets;"));

console.log(sqlQuery("SHOW TABLES"));