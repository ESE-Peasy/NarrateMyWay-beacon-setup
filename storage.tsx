import * as SQLite from "expo-sqlite";

import * as nmwTable from "./nmwstandard.json";

// Interface for data
interface location {
  code: string;
  description: string;
}

// Storage Class
class Storage {
  //
  // local variables
  db: SQLite.WebSQLDatabase;

  constructor() {
    this.db = this.createDb();
  }

  // Create database
  createDb() {
    const db = SQLite.openDatabase("database.db");
    return db;
  }

  // Create and populate database tables
  createTable() {
    {
      this.db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS locationCodes (id string primary key not null, description text, categoryDepth int);"
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS versionRecord (id integer primary key not null, version text);"
        );
        tx.executeSql("SELECT * FROM versionRecord", [], (_, results) => {
          if (results.rows.length == 0) {
            tx.executeSql("INSERT INTO versionRecord (version) VALUES (?)", [
              nmwTable.version,
            ]);
            nmwTable.nmw.forEach((value) => {
              // Getting depth of code, which will correspond to the number of zeroed fields
              const fields = value.code.split("-");
              let zero_count = 0;
              for (let field of fields) {
                if (field == "0") {
                  zero_count += 1;
                }
              }

              const categoryDepth = fields.length - zero_count;
              tx.executeSql(
                "INSERT INTO locationCodes (id, description, categoryDepth) VALUES (?,?,?)",
                [value.code, value.description, categoryDepth]
              );
            });
          } else if (results.rows.item(0) != nmwTable.version) {
            tx.executeSql("INSERT INTO versionRecord (version) VALUES (?)", [
              nmwTable.version,
            ]);

            nmwTable.nmw.forEach((value) => {
              // Getting depth of code, which will correspond to the number of zeroed fields
              const fields = value.code.split("-");
              let zero_count = 0;
              for (let field of fields) {
                if (field == "0") {
                  zero_count += 1;
                }
              }

              const categoryDepth = fields.length - zero_count;
              tx.executeSql(
                "INSERT INTO locationCodes (id, description, emblem) VALUES (?,?,?)",
                [value.code, value.description, categoryDepth]
              );
            });
          }
        });
      }, null);
    }
  }

  // Input location code data
  loadData(data: location) {
    this.db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO locationCodes (id, description, emblem) VALUES (? ,?, ?)",
        [data.code, data.description, data.emblem]
      );
    }, null);
  }

  // Clear storage
  clearStorage() {
    this.db.transaction((tx) => {
      tx.executeSql("DROP TABLE locationCodes;");

      tx.executeSql("DROP TABLE versionRecord;");
    });
  }

  // Print the version of currently stored data
  printVersionData() {
    this.db.transaction((tx) => {
      tx.executeSql("SELECT * FROM versionRecord", [], (_, { rows }) =>
        console.log(JSON.stringify(rows))
      );
    });
  }

  lookupCodesByDepth(
    categoryDepth: number,
    parentCode: String,
    callback: Function
  ) {
    if (parentCode == null) {
      parentCode = "0-0-0";
    }
    const fields = parentCode.split("-");
    let regexedFields = [];
    for (let field of fields) {
      if (field == "0") {
        regexedFields.push("%");
      } else {
        regexedFields.push(field);
      }
    }

    this.db.transaction((tx) => {
      tx.executeSql(
        "SELECT id, description FROM locationCodes WHERE (categoryDepth=? AND id LIKE ?)",
        [categoryDepth, regexedFields.join("-")],
        (_, results) => {
          callback(results.rows);
        }
      );
    });
  }
}

export { Storage, location };
