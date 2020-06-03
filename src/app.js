const path = require('path')
var http = require("http");
var chokidar = require('chokidar');
var xlsx = require('node-xlsx');
const iconvLite = require('iconv-lite');
const fs = require('fs');

const fileCompile = require('./render-file/render-file')
const database = require('./databas')
const Users = require('./users/users')
const users = new Users()
const pathurl = path.join(__dirname, '../file/stockExportData.xls')
// 读取文件内容
function render() {
  const workSheetsFromFile = xlsx.parse(pathurl);
  workSheetsFromFile.forEach(item => {
    if(item.data && item.data.length > 0) {
      fs.writeFile(pathurl, '', function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('清空源文件')
        }
      })
    }
    item.data.forEach(data => {
      insetData(data.map(col => iconvLite.decode(col.toString(), 'gbk')))
    })
  })
}
render()
// 监视文件变化
var watcher = chokidar.watch(path.join(__dirname, '../file'), {
  ignored: /[\/\\]\./,
  persistent: true,
  interval: 2000,
});

let togger = true
watcher
    .on('change', function (event, path1, details) {
      console.log('文件变化')
      if (togger) {
        togger = false
        setTimeout(() => {
          togger = true
          render()
        }, 1000)
      }
    })


// 数据插入数据库
function insetData(item) {
  if (item) {
    // id, stockName, stockCode, stockPrice, stockGains, stockVolume, updateTime
    var addSql = 'INSERT record (stockCode, stockName, updateTime, stockPrice, stockGains, stockVolume, type) VALUES(?,?,?,?,?,?,?)';

    database.query(addSql, item, function (err, result) {
      if (err) {
        console.error(item.stock_name + '---插入失败---' + item.update_time);
        return;
      }
    });
  }
}

// // 通知更新接口
// http.createServer(function(req,res){
//   console.log('aaaa')
//   var filename = '.'+req.url;
//   if(filename==='./stream'){
//     res.writeHead(200,{
//       "Content-Type":"text/event-stream",
//       "Cache-Control":"no-cache",
//       "Connection":"keep-alive",
//       "Access-Control-Allow-Origin": '*',
//     });
//
//     res.write("retry: 10000\n");
//     res.write("event: connecttime\n");
//     res.write("data: "  + "connect\n\n");
//     res.write("data: "  + "connect\n\n");
//
//     users.add(res, req)
//
//   } else {
//     res.write('error')
//     res.end()
//   }
//
// }).listen(3009);


console.log("监听中。。。。");