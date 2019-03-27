const fs = require('fs');
const iconvLite = require('iconv-lite');

const fileCompile = {
  render(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err)
        } else {
          // const txtGbk = iconvLite.decode(data, 'gbk')
          // const txtUtf8 = iconvLite.decode(txtGbk, 'utf8')


          const txtGbk = iconvLite.decode(data, 'gbk')

          // const txtUtf8 = iconvLite.decode(txtGbk, 'utf8')

          if(!(txtGbk && txtGbk.trim())) {
            return
          }
          // 读取完清空原文件
          this.clearFile(path)
          resolve(this.compile(txtGbk))
        }
      });
    })
  },
  compile(data) {
    const dataArr = []
    data.split('\n').forEach((item) => {
      if(item.trim()) {
        dataArr.push(item.trim())
      }
    })

    const dataObj = []

    dataArr.forEach((item) => {
      const itemArrRoot = item.split('\t')
      const itemArr = []
      itemArrRoot.forEach(item => {
        if (item.trim()) {
          itemArr.push(item.trim())
        }
      })
      const obj = {
        stock_code: itemArr[0],
        stock_name: itemArr[1],
        update_time: itemArr[2],
        formula_time: itemArr[3],
        num1: itemArr[4],
        num2: itemArr[5],
        num3: itemArr[6],
      }
      dataObj.push(obj)
    })
    return dataObj
  },

  clearFile(path) {
    fs.writeFile(path, '', function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('清空源文件')
      }
    })
  }
}

module.exports = fileCompile