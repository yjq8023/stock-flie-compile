class Users {
  constructor() {
    this.list = []
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
    this.list.push(res)
  }
}

module.exports = Users