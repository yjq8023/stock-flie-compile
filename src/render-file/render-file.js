const fs = require('fs');

const fileCompile = {
  render(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(this.compile(data.toString('utf8')))
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
      const itemArrRoot = item.split('  ')
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
  }
}

module.exports = fileCompile