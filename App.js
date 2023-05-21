// /Users/zaidshah/mongodb/bin/mongod --dbpath=/Users/zaidshah/data/db
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const gridfs = require("gridfs-stream");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config({path:'./config.env'});
require("./src/Components/Connections.js");
const bodyparser = require("body-parser");
const ApiKey = require("./src/Components/Models/Apis.js");
const Users = require("./src/Components/Models/Users.js");
const RandomWord = require("./src/Components/Models/Randomwors.js");
const ApiCategory = require("./src/Components/Models/ApiCategory.js");
const Apidata = require("./src/Components/Models/Apidata.js");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
const randomnumber = require("./src/Components/Models/RandomNumber.js");
const randomjokes = require("./src/Components/Models/Randomjokes.js");
console.log(process.env.DATABASE);
const storage = new GridFsStorage({
  url: process.env.DATABASE,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "CodeSolutions",
      filename: `${Date.now()}-CodeSolutions-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  ApiCategory.find({}, (err, data) => {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      res.send(data);
    }
  });
});
app.post("/addApi", upload.single("ApiImage"), (req, res) => {
  const { Category, Name, Description } = req.body;
  const Image = req.file.filename;
  const apcat = new ApiCategory({ Category, Name, Image, Description });
  apcat.save();
  res.send("send");
});
app.post("/addApidata",(req, res) => {
  const Name=req.body.Name;
  const Data=JSON.stringify(req.body.Data);
   const a=new Apidata({Name,Data})
   a.save();
   res.send("ok")
});
app.get("/getapidata",(req,res)=>{
  const abc = req.headers["x-key"];
  ApiKey.findOne({ Key: abc }, (err, datas) => {
    if (err) {
      res.send(err);
    } else {
      if (datas) {
        Apidata.find({Name:req.query.name}, (err, dat) => {
          res.send(dat);
        });
      } else {
        res.send("not subscribed");
      }
    }
  });
})
app.post("/addKey", (req, res) => {
  const { AppName, Key, username } = req.body;
  const ap = new ApiKey({ AppName, Key, username });
  ap.save();
  res.send("send");
});
let fs;
const con = mongoose.connection;
con.once("open", () => {
  fs = gridfs(con.db, mongoose.mongo);
  fs.collection("CodeSolutions");
});
app.get("/getApis/:name", async (req, res) => {
  try {
    const file = await fs.files.findOne({ filename: req.params.name });
    const read = fs.createReadStream(file.filename);
    read.pipe(res);
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log("port started");
});
app.post("/newUser", (req, res) => {
  const f = req.body;
  const us = new Users(f);
  us.save();
  res.send("added");
});
app.post("/updateUser", (req, res) => {
  const filter = { uname: req.body.uname};
  const update = {
    $set: {
      name:req.body.name ,
      email: req.body.email,
      pass: req.body.pass
    }
  };
  Users.updateOne(filter,update, (err, data) => {
    if (err) {
      res.send("no");
    } else {
      res.send("updated");
    }
});
});
app.post("/login", (req, res) => {
  const { uname, pass } = req.body;
  Users.findOne({ uname: uname, pass: pass }, (err, data) => {
    if (err) {
      res.send("no");
    } else {
      res.send(data);
    }
  });
});
app.get("/getuser", (req, res) => {
  Users.find({}, (err, data) => {
    if (err) {
      res.send("no");
    } else {
      res.send(data);
    }
  });
});
app.post("/getKe", (req, res) => {
  ApiKey.findOne({ username: req.body.usname }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
app.post("/getinfo", (req, res) => {
  ApiKey.find({ username: req.body.uname }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
app.get("/getapi", (req, res) => {
  ApiCategory.find({}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.get("/RandomWords", (req, res) => {
  const abc = req.headers["x-key"];
  ApiKey.findOne({ Key: abc }, (err, datas) => {
    if (err) {
      res.send(err);
    } else {
      if (datas) {
        RandomWord.find({}, (err, dat) => {
          res.send(dat);
        });
      } else {
        res.send("not subscribed");
      }
    }
  });
});
app.get("/NumbersAPI", (req, res) => {
  const abc = req.headers["x-key"];
  ApiKey.findOne({ Key: abc }, (err, datas) => {
    if (err) {
      res.send(err);
    } else {
      if (datas) {
        randomnumber.find({}, (err, dat) => {
          res.send(dat);
        });
      } else {
        res.send("not subscribed");
      }
    }
  });
});
app.get("/Jokes", (req, res) => {
  const abc = req.headers["x-key"];
  ApiKey.findOne({ Key: abc }, (err, datas) => {
    if (err) {
      res.send(err);
    } else {
      if (datas) {
        randomjokes.find({}, (err, dat) => {
          res.send(dat);
        });
      } else {
        res.send("not subscribed");
      }
    }
  });
});

app.post('/delinfo',(req,res)=>{
  ApiKey.deleteOne({_id:req.body.delname},(err,dat)=>{
    if(err){
      res.send('error');
    }else{
      console.log(dat);
      res.send("deleted");
    }
  });
})
