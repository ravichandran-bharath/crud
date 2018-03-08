var express = require('express');
var app = express();
var mongo = require('mongodb');
var assert = require('assert');
var bodyParser = require('body-parser');
var cors = require('cors');
var ObjectId = require('mongodb').ObjectId; 


app.set('port', (process.env.PORT || 8000));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var url = "mongodb://stellosphere:vision2020@marvolez-shard-00-00-fch1s.mongodb.net:27017,marvolez-shard-00-01-fch1s.mongodb.net:27017,marvolez-shard-00-02-fch1s.mongodb.net:27017/test?ssl=true&replicaSet=Marvolez-shard-0&authSource=admin";

//Sample API
app.get('/', function(req, res){
    res.send("CRUD Operations");
});


//API to display UserDetails
//tested 14th February 2018: Bharath Ravichandran
app.get('/showUserDetails', function(req, res){
    var resultArry = [];
    mongo.connect(url, function(err, db){
      assert.equal(null, err);
      var cursor = db.collection('UserDetails').find();
      cursor.forEach(function(doc, err){ 
        assert.equal(null, err);
        resultArry.push(doc);
      },
        function(){
            db.close();
            if (err) {
                console.log(err);
            } else {
                res.send(resultArry);
            }
        });
    });
});


//API to display edit UserDetails
//tested 14th February 2018: Bharath Ravichandran
// app.post('/showEditUserDetails', function(req, res){
//     var resultArry = [];
//     mongo.connect(url, function(err, db){
//       assert.equal(null, err);
//       var cursor = db.collection('UserDetails').find({
//           "id": req.body.id
//       });
//       cursor.forEach(function(doc, err){
//         assert.equal(null, err);
//         resultArry.push(doc);
//       },
//         function(){
//             db.close();
//             res.send(resultArry);
//         });
//     });
// });

//view display edit User Details 
app.get('/showEditUserDetails', function(req, res){
    var resultArry = "";
    mongo.connect(url, function(err, db){
      assert.equal(null, err);
      var cursor = db.collection('UserDetails').findOne({ _id: req.body._id });
  
        assert.equal(null, err);
        // resultArry.push();

        db.close();
        res.send({results: resultArry });

   });
  });


//API FOR add UserDetails
//Tested on 14th February 2018 : Bharath Ravichandran
app.post('/addUserDetails', function(req, res){
  var newUserDetails = {
      
    firstname: req.body.firstname,
    address: req.body.address,
    email: req.body.email,
    contact: req.body.contact,
  };
  mongo.connect(url, function(err, db){
  assert.equal(null, err);
      db.collection('UserDetails').insertOne(newUserDetails,function(err, result){
        if(err){
            res.send("Failed adding user details");
        }else{
            res.send("Successfully added user details");
        }
            db.close();
      });
  });
});


//API for update UserDetails
//Tested on 14th February 2018 : Bharath Ravichandran
app.put('/updateUserDetails', function(req, res){
  
  var updateUserDetails = {
      name: req.body.firstname,
      address: req.body.address,
      email: req.body.email,
      contact: req.body.contact
  };

  mongo.connect(url, function(err, db){
      assert.equal(null, err);
      db.collection('UserDetails').findOneAndUpdate({
          name: req.body.firstname,
          address: req.body.address,
          email: req.body.email,
          contact: req.body.contact}, 
          
        { $set: { 
            name: req.body.firstname,
            address: req.body.address,
            email: req.body.email,
            contact: req.body.contact}
        }, {upsert: true},function(err, result){

        if(err){
            res.send("Failed updating user details");
        }else{
            res.send("Successfully updated user details");
        }
            db.close();
      });
  });   
});


//API to delete UserDetails
//Tested on 14th February 2018 : Bharath Ravichandran
// app.delete('/deleteUserDetails', function(req, res){
//   var resultArry = [];
//   mongo.connect(url, function(err, db){
//     assert.equal(null, err);
//     var cursor = db.collection('UserDetails').remove({_id:req.body.id});
//       assert.equal(null, err);
//       resultArry.push(doc);

//       db.close();
//       res.send(resultArry);

//   });
// });


//API to delete UserDetails
//Tested on 14th February 2018 : Bharath Ravichandran
app.delete('/deleteUserDetails', function(req, res){
    var resultArry = [];
    mongo.connect(url, function(err, db){
      assert.equal(null, err);
      var cursor = db.collection('UserDetails').findOneAndDelete(
        { 
            _id: req.body.id
        }
      );
      if(err){
        res.send("false");
      }else{
        res.send("true");
      }
        db.close();
    });
});