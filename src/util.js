'use strict'

var mysql = require('mysql');
var nodemailer = require('nodemailer');
var db = {};

var mysql_pool = mysql.createPool({
  connectionLimit : 10,    
  host            : 'localhost',    
  user            : 'root',    
  password        : 'root',    
  database        : 'world'
})

//执行sql语句并返回结果    
db.query = function(sql){    
  
  return new Promise(function(resolve, reject){  
  
    if (!sql) {    
        reject('传参错误!');    
        return;    
    }    
  
    mysql_pool.query(sql, function(err, rows, fields) {    
      if (err) {    
        console.log(err);    
        reject(err)   
        return;    
      };    
  
      resolve(rows);  
    });    
  })  
    
};  
  
//发送邮件,带附件  
db.sendMail = function (xlsxname) {  
  
  var transporter = nodemailer.createTransport({  
    service: 'qq',  
    auth: {  
      user: '498714114@qq.com',  
      pass: 'qawhtpjfitstbhec'     
    }  
  });  
  
  var mailOptions = {  
    from: '498714114@qq.com',   
    to: `chenxm0127@126.com`,   
    subject: '老板,您要的excel来了,格式您自己处理下!',   
    html: `<h2>我发誓,我是手动导出的</h2>` ,  
    attachments:[{  
        filename : xlsxname,  
        path : `./${xlsxname}`  
    }]  
  };  
  return new Promise(function(resolve, reject){  
  
    transporter.sendMail(mailOptions, function (error, info) {  
      if (error) {  
        reject(error);  
      }else{  
        resolve(info);  
      }  
    });  
  })  
}  
  
//格式化当前时间  
db.nowDate = function(){  
    var date = new Date();  
    var fmtTwo = function (number) {  
    return (number < 10 ? '0' : '') + number;  
  }  
    var yyyy = date.getFullYear();  
  var MM = fmtTwo(date.getMonth() + 1);  
  var dd = fmtTwo(date.getDate());  
  
  var HH = fmtTwo(date.getHours());  
  var mm = fmtTwo(date.getMinutes());  
  var ss = fmtTwo(date.getSeconds());  
  
  return '' + yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;  
  
}    
module.exports = db;

