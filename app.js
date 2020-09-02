const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Using Mongoode for creating database and objects created 2 tables in my database. But there is nothing metioned in email that
//should I create relationship between both the tables or not so I am confused. And there is nothing mentioned about SQL or NoSQL so I am using NoSQL database.
//I can do this with sqlserver as well but I am more comfortable with mongodb so I am choosing mongodb because when I called HR Mam then she said you should do this with mongodb.
// Creating relation between two object in mongodb
// Example code-
// db.users.insert{
//   _id: 1,
//   firstname: "Rajat",
//   lastname: "Gupta",
//   email: "remixrajat1@gmail.com",
//   password: "123456",
//   adress:[{
//   location: "India",
//   pincode: "211006",
// }]
// }
// or we can define separately
//example-
// {
//   user_id: 1,
//   firstname: "Ramu",
//   lastname: "Singh",
//   email: "ranu1@gmail.com",
//   password: "1234567"
// }
//{
//   location: "India",
//   pincode: "211006",
//   user_id: [1]
// }
mongoose.connect("mondodb://localhost:27017/detailDB", {useNewUrlParser: true, useUnifiedTopology: true});

const detailSchema = {
  firstname: String,
  lastname: String,
  email: String,
  password: String
};

const Detail = mongoose.model("Detail", detailSchema);

app.route("/details")

.get(function(req, res){
  Detail.find(function(err, foundDetails){
    if (!err) {
      res.send(foundDetails);
    } else {
      res.send(err);
    }
  });
})

// Note - I am sending all fields through POSTMAN beacuase I am using Rest API. If we want to add details through this dile then we can create a req.body and we can define objects in that.
// example - req.body = {
//firstname: "Ramesh",
//lastname: "Mishra",
//email: "abc@gmail.com",
//password: "hsjsj"
//}
.post(function(req, res){

  const newDetail = new Detail({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password
  });

  newDetail.save(function(err){
  if (!err){
    res.send("Successfully added a new detail.");
  } else {
    res.send(err);
  }
});
})

.delete(function(req, res){

  Detail.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all details.");
    } else {
      res.send(err);
    }
  });
});


app.route("/details/:detailEmail")

.get(function(req, res){

  Detail.findOne({email: req.params.detailEmail}, function(err, foundDetail){
    if (foundDetail) {
      res.send(foundDetail);
    } else {
      res.send("No details matching that email was found.");
    }
  });
})

.put(function(req, res){

  Detail.update(
    {email: req.params.detailEmail},
    {firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, lastname: req.body.password},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully edited and updated selected details.");
      }
    }
  );
})

.patch(function(req, res){

// req.body = {
//password: "Sonam@hdjdjd"
//}

  Detail.update(
    {email: req.params.detailEmail},
    //{$set: req.body} Using this we can change any field which is defined in the req.body
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated detail(password).");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Detail.deleteOne(
    {email: req.params.detailEmail},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding detail.");
      } else {
        res.send(err);
      }
    }
  );
});


  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
