var Index = require('../app/controllers/index');
var User = require('../app/controllers/user.js');
var Article = require('../app/controllers/article.js');

module.exports = function(app){
  //index
  app.get('/',Index.index);

  //User
  app.post('/user/signup',User.signup);
  app.post('/user/signin',User.signin);
  app.get('/user/check/:name',User.check);
  app.post('/user/update',User.update);
  app.get('/user/query',User.query);

  //Article
  app.post('/article/add',Article.add);
  app.get('/article/query',Article.query);
  // app.get('/article/queryAll',Article.query);
  app.get('/article/query/:title',Article.getArticleData);
  app.put('/article/update/:title',Article.updateArticle);
  app.delete('/article/del/:title',Article.deleteArticle);
}
