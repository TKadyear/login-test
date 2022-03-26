const SECRET = "randomhashstring";

const express = require('express');
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

app.use(express.json());


const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({msg:"A token is required for authentication"});
    }
    try {
      const decoded = jwt.verify(token, SECRET);
      console.log(decoded)
    } catch (err) {
      return res.status(401).send({msg:"Invalid Token"});
    }
    return next();
  };


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/protected_data',verifyToken,(req,res) => {
    res.status(200).send({msg:"this is a secret"})
});

app.post('/login', (req, res) => {

    if(req.body.user && req.body.password){
        let user = req.body.user;
        let pwd  = req.body.password;
        if(user === "tamara" && pwd === "12345"){
            const token = jwt.sign(
                { user },
                SECRET,
                {
                  expiresIn: "2h",
                }
              );
              let user_data = {user,token}
            res.status(200).send(user_data)
        }else{
            res.status(401).send({msg: "Wrong data"})
        }
    }else{
        res.status(400).send({msg:"User/password required"})
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})