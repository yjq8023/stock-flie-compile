class Users {
  constructor() {
    this.list = []
    this.count = 1
  }
  send() {
    this.list.forEach((item) => {
      item.write("data: "  + "UPDATE\n\n");
    })
  }
  close(item) {
    this.list.splice(this.list.indexOf(item), 1)
  }
  add(res, req) {
    var that = this
    req.connection.addListener("close", function () {
      that.close(res)
    }, false);
    console.log('user join' + this.count++)
    this.list.push(res)
  }
}

module.exports = Users