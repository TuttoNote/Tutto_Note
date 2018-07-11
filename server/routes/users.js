/**
 *  /users* 라우터
 */

const express = require('express');
let router = express.Router();

// Users 모델 불러오기
const Users = require('../models/users');

// Logout(Session.destroy test)
router.get('/logout', (req, res, next) =>{
  req.session.destroy((err)=>{
    // session 제거
  });
  res.json({result : 0});
});

// /users/login POST(body: userid,name,password) Login(Save Session)
router.post('/login', (req, res, next) =>{
  let sess;
  let id = req.body.userid;
  let pw = req.body.password;

  Users.findOne({userid: id},(err, user) => {
    if (err) {
      return res.status(500).json({status: 3});
    }
    if (!user) {
      return res.status(404).json({result : 2});
    }
    Users.findOne({userid: id,password: pw},(err, user) =>{
      if (err) {
        return res.status(500).json({status: 3});
      }
      if (!user) {
        return res.status(404).json({result : 1});
      }
      sess = req.session;
      sess._id = user._id;
      sess.name = user.name;
      res.json({
        result : 0,
        _id: sess._id,
        name: sess.name
      });
    });
  });
});

// /users POST (body: userid, name, password)
router.post('/', (req, res, next) => {
  var users = new Users();
  users.userid = req.body.userid;
  users.name = req.body.name;
  users.password = req.body.password;

  Users.findOne({userid: req.body.userid},(err, user) => {
    if(!user){
      users.save((err) => {
        if (err) {
          return res.status(500).json({status: 3});
        }
        res.json({result: 0});
      });
    }else{
      res.json({result: 1});
    }
  });
});

// /users/:userid GET
router.get('/:userid', (req, res, next) => {
  Users.findOne({userid: req.params.userid}, (err, user) => {
    if (err) {
      return res.status(500).json({status: 3});
    }
    if (!user) {
      return res.status(404).json({status: 1});
    }
    res.json(user);
  });
});

// 라우터 내보내기

module.exports = router;
