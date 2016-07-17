var fs = require('fs');
var url = require('url');

//index page
exports.index = function(req,res){
  var readPath = BASE_DIR + '/app/views/' + url.parse('main.html').pathname;
  fs.readFile(readPath,function(err,data){
    res.end(data);
  });
};
