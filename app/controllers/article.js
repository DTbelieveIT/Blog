var Article = require('../models/article.js');

//增加文章
exports.add = function(req,res){
  console.log(req.body);
  var newArticle = new Article({
    title:req.body['title'],
    type:req.body['type'],
    content:req.body['content']
  })
  newArticle.save(function(err){
    if(err){
      return res.send({status:'fail',err:err});
    }else{
      console.log('save success');
      return res.send({status:'success'});
    }
  })
}

// 查询所有文章
exports.query = function(req,res){
  Article.fetch(function(err,articles){
    if(err){
      console.log(err);
      return res.send({err:err});
    }
    res.send(JSON.stringify(articles));
  })
}

//查找想要查看的文章
exports.getArticleData = function(req,res){
  var articleName = req.params.title;
  Article.findByName(articleName,function(err,article){
    if(err){
      return res.send({err:err});
    }else{
      return res.send({stausCode:'OK',article:article});
    }
  })
}

//更新文章
exports.updateArticle = function(req,res){
  var articleName = req.params.title;
  Article.findByName(articleName,function(err,data){
    if(!data){
      res.statusCode = 404;
      return res.send({err:'Not Found'});
    }else{
      var condition = {title:articleName};
      var update = {$set:{
        type:req.body['type'],
        content:req.body['content']
      }};
      var options ={upsert:true};
      Article.update(condition,update,options,function(err){
        if(err){
          console.log(err);
        }else{
          return res.send({statusCode:'更新成功'});
        }
      })
    }
  })
}

//删除文章
exports.deleteArticle = function(req,res){
  Article.findByName(req.params['title'],function(err,data){
    if(data.length <= 0){
      res.statusCode = 404;
      return res.send({err:'Not Found'});
    }else{
      var condition = {title:req.params['title']};
      Article.remove(condition,function(err){
        if(err){
          console.log(err);
        }else{
          return res.send({statusCode:'删除成功'});
        }
      })
    }
  })
}
