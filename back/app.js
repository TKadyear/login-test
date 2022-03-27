const SECRET = "randomhashstring";

const express = require('express');
const jwt     = require("jsonwebtoken");
const crypto  = require("crypto");
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

let all_users = [{user:"tamara",password:"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5"}]




const check_login = (user,pwd) => {
    let found_user = check_user(user);
    let hash = crypto.createHash('sha256').update(pwd).digest('hex'); 
    return (found_user && (found_user.password === hash))
}

const check_user = (user) =>{
    let found_user = all_users.find((item)=>{
        return item.user === user
    });

    return (found_user !== undefined ? found_user : false) 
}


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
    res.send({msg:'Hello World!'})
})

app.get('/protected_data',verifyToken,(req,res) => {
    res.status(200).send({msg:"this is a secret"})
});

app.post('/register',(req,res) => {
    if(req.body.user && req.body.password){
        let user = req.body.user;
        let pwd  = req.body.password;
        if(check_user(user) === false){
            all_users.push({
                user : user,
                password : crypto.createHash('sha256').update(pwd).digest('hex')
            })
            res.status(200).send({msg:"user registered"})
        }else{
            res.status(400).send({msg:"User " + user + " already exists"})
        }
    }else{
        res.status(400).send({msg:"Wrong data"})
    }
})

app.post('/login', (req, res) => {

    if(req.body.user && req.body.password){
        let user = req.body.user;
        let pwd  = req.body.password;
        if(check_login(user,pwd)){
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