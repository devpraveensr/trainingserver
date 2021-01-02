const express = require("express");
const app =express();
//const mysql = require("mysql");

/*const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"training_manager"
  });

app.get("/", (req,res) => {
     
    console.log("Connected!");
    const sql = "INSERT INTO user_roles (id, role_name) VALUES ('2', 'Administrator')";
    db.query(sql,(err, result) => {
        res.send("Test data");
    });
    
});*/

app.listen(3003, ()=>{
    console.log("This is the log");
});

 
