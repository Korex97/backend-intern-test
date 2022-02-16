var express = require('express');
const db = require("../db");
var bcrypt = require("bcrypt");
var execute = db.pool;
var tableName = db.dbColums.tabeleName;
var router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth"); 
const app = require("../app");

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const queryString = `Select * FROM ${tableName} ORDER BY id ASC;`;
  await execute.query(queryString, (err, results) => {
    if (err){
      res.status(404).send(err)
    }
    if (results){
      res.status(200).send(results.rows);
    }
  })
  
});

router.post("/login", async(req, res) => {
  const {email, password} = req.body;

  if (!(email && password)){
    res.status(400).send({
      error: "All input is required"
    });
  }

  queryString = `Select * From ${tableName} WHERE email = $1;`
  const existingUser = await execute.query(queryString, [email] );

  const userDetails = existingUser.rows[0];

  if (existingUser.rows.length > 0){
    if (await bcrypt.compareSync(password, userDetails.password)){
        const token = jwt.sign(
          {user_id: userDetails.id, email},
          process.env.TOKEN_KEY || "something", {
            expiresIn: "30m"
          });

        var addTokenQuery = `Update ${tableName} SET token = $1 WHERE id = $2 RETURNING *;`;
        var tokenAdded = await execute.query(addTokenQuery, [token, userDetails.id]);
        res.status(200).send(tokenAdded.rows[0]);
        
    }else{
      res.status(400).send({
        error: "Wrong Password"
      })
    }
  }else{
    res.status(400).send({
      error: "Invalid email"
    })
  }

});

router.post("/register", async(req, res) => {
    try{
      const {firstname, lastname, email, phone, password} = req.body;

      if (!(email && password && firstname && lastname && phone)) {
        res.status(400).send({
          error: "All input fields are required"
        });
      }
  
      queryString = `Select * From ${tableName} WHERE email = $1;`
      const existingUser = await execute.query(queryString, [email] );
      
  
      if (existingUser.rows.length > 0){
        res.status(400).send({
          error: "User Already Exist"
        })
      } else {
        encryptedPassword = bcrypt.hashSync(password, 10);
        const user = [
          firstname,
          lastname,
          email.toLowerCase(),
          phone,
          encryptedPassword
        ];
    
    
        var createUserQuery = `
            Insert INTO ${tableName} (
              ${db.dbColums.firstName}, 
              ${db.dbColums.lastName}, 
              ${db.dbColums.email}, 
              ${db.dbColums.phone}, 
              ${db.dbColums.password}) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    
          console.log(createUserQuery);
        
          const newUser = await execute.query(createUserQuery, user);
    
          const newUserID = newUser.rows[0].id
    
        // Create token for user
         const token = jwt.sign(
              {user_id: newUserID},
              process.env.TOKEN_KEY || "something", {
              expiresIn: "30m"
          });
    
          var addTokenQuery = `Update ${tableName} SET token = $1 WHERE id = $2 RETURNING *;`;
          var tokenAdded = await execute.query(addTokenQuery, [token, newUserID]);
          res.status(200).send(tokenAdded.rows[0]);
      }
    }catch (err){
      res.status(501).send(err)
    }
})

router.delete("/:id", async(req, res) => {
  const { id } = req.params;

  let deleteQuery = `Delete FROM ${tableName} WHERE id = $1;`

  execute.query(deleteQuery, [id], (err, results) => {
    if (results){
      res.status(500).json(`User with id = ${id} was Deleted`);
    }
    
  })
})

module.exports = router;
