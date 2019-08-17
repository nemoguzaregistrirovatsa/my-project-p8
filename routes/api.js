/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});


module.exports = function (app) {
  
  mongoose.connect(process.env.DB, { useNewUrlParser: true });

  const SchemaP8 = new mongoose.Schema({
      title: String,
      commentcount: Number,
      comments: [String]
    });
  const ModelP8 = mongoose.model('ModelP8', SchemaP8);
  
  /*ModelP8.remove({}, (err) => {
    if (err) console.log('Error reading database!')
  });*/
  
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
     ModelP8.find({}, (err, data) => {
       if (err) console.log('Error reading database!')
       else res.json(data);
     })
    })
    
    .post(function (req, res){
      //var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (req.body.title) {
        var book = new ModelP8({
          title: req.body.title,
          commentcount: 0
        });
        book.save((err, data) => {
          if (err) console.log('Error saving to database!');
          res.json(data);
        });
      } else res.send('missing title');
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      ModelP8.remove({}, (err, data) => {
        if (err) console.log('Error deleting from database!')
        else res.json('complete delete successful');
      })
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      //var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      ModelP8.findOne({_id: req.params.id}, (err, data) => {
        if (err) {
          console.log('Error reading database!');
          res.send('no book exists');
        }
        else res.json(data);
      });
    })
    
    .post(function(req, res){
      //var bookid = req.params.id;
      //var comment = req.body.comment;
      //json res format same as .get
      ModelP8.findOne(
        {_id: req.params.id},
        (err, data) => {
          if (err) {
            console.log('Error reading database!');
            res.send('no book exists');
          }
          else {
            data.comments.push(req.body.comment);
            data.commentcount++;
            data.save((err,data) => {
              if (err) console.log('Error saving to database!')
              else res.json(data);
            });
          };
        }
      );
    })
    
    .delete(function(req, res){
      //var bookid = req.params.id;
      //if successful response will be 'delete successful'
      ModelP8.remove({_id: req.params.id}, (err, data) => {
        if (err) {
          console.log('Error deleting from database!');
          res.send('no book exists');
        }
        else res.send('delete successful');
      })
    });
  
};