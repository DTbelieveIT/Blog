var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
  title:String,
  type:String,
  content:String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

ArticleSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
});


ArticleSchema.statics = {
  fetch:function(cb){
    return this
    .find({})
    .sort('meta.updateAt')
    .exec(cb);
  },
  findById:function(id,cb){
    return this
    .findOne({_id:id})
    .exec(cb);
  },
  findByName:function(name,cb){
    return this.find({title:name},function(err,result){
      if(result.length > 0){
        console.log('找到重复文章');
      }else{
        console.log('文章名没有重复');
      }
      cb(err,result);
    })
  }
};

module.exports = ArticleSchema;
