const path = require('path')
var http = require("http");
var chokidar = require('chokidar');


const fileCompile = require('./render-file/render-file')
const database = require('./databas')
const Users = require('./users/users')
const users = new Users()
const pathurl = '../../stock-file-data/data.txt'
console.log(path.resolve(__dirname , pathurl));

// 读取文件内容
async function render(path) {
  const data = await fileCompile.render(path)
  // 插入数据库
  data.forEach((item) => {
    insetData(item)
  })

  users.send()
}

// 监视文件变化
var watcher = chokidar.watch(path.resolve(__dirname , pathurl), {
  ignored: /[\/\\]\./, persistent: true
});

watcher
    .on('change', function(event, path1, details) {
      render(path.resolve(__dirname , pathurl))
    })


// 数据插入数据库
function insetData(item) {
  if(item && item.stock_code && item.stock_name) {
    var  addSql = 'INSERT record (stock_code, stock_name, update_time, formula_time , num1 , num2 ,num3 ) VALUES(?,?,?,?,?,?,?)';
    var  addSqlParams = [
      item.stock_code,
      item.stock_name,
      item.update_time,
      item.formula_time,
      item.num1,
      item.num2,
      item.num3
    ];

    database.query(addSql, addSqlParams, function (err, result) {
      if(err){
        console.log(item.stock_name + '---插入失败---' + item.update_time);
        return;
      }

      console.log(item.stock_name + '---插入成功---' + item.update_time);
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