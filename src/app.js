const path = require('path')
var chokidar = require('chokidar');


const fileCompile = require('./render-file/render-file')
const database = require('./databas')


// 读取文件内容
async function render(path) {
  const data = await fileCompile.render(path)
  // 插入数据库
  data.forEach((item) => {
    insetData(item)
  })
}

// 监视文件变化
var watcher = chokidar.watch(path.resolve(__dirname , './render-file/test.txt'), {
  ignored: /[\/\\]\./, persistent: true
});

watcher
    .on('raw', function(event, pathurl, details) {
      render(path.resolve(__dirname , './render-file/test.txt'))
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
        console.log('插入失败');
        return;
      }

      console.log('插入成功');
    });
  }
}