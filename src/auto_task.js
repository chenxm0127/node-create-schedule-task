var xlsx = require('node-xlsx');  
var schedule = require("node-schedule");  
var mysql = require('./util');  
var fs = require('fs');  
var auto = function(){  
   console.log('current path:'+__dirname);
    mysql  
    //查询数据,并转化成生成xlsx所需的格式  
        .query('select * from country')  
        .then(function(rows){  
            var datas = [];  
            rows.forEach(function(row){  
            var newRow = [];  
                for(var key in row){  
                    newRow.push(row[key]);  
                }  
                datas.push(newRow);  
            })  
            return Promise.resolve(datas);  
        })  
        //生成xlsx文件  
        .then(function(datas){  
            var buffer = xlsx.build([{name: "今天的收入", data: datas}]);  
            var xlsxname = './result/'+`${mysql.nowDate().split(' ')[0]}.xlsx`;  
            return new Promise(function(resolve, reject){  
  
                fs.writeFile(xlsxname, buffer, 'binary',function(err){  
                    if (err) {  
                        throw new error('创建excel异常');  
                        return;  
                    }  
                    resolve(xlsxname)  
                })  
            })  
        })  
        //发送邮件,返回信息  
        .then(function(xlsxname){  
  
            return mysql.sendMail(xlsxname);  
        })  
        .then(function(info){  
            console.log(info);  
        })  
        //捕捉未处理的异常  
        .catch(function(e){  
            console.log(e);  
        });  
      
}  
  
var rule      = new schedule.RecurrenceRule();  
var t = [];  
for (var i = 0; i < 60; i++) {  
    t.push(i);  
}  
var times     = t;  
rule.second   = times;  
schedule.scheduleJob(rule, function(){  
  auto();  
});  