// User 数据模型（Mongoose Schema） — 定义用户表结构
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // 唯一索引，防止同名用户
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true }); // 自动添加 createdAt / updatedAt 字段

userSchema.pre('save', async function () {
  if (!this.isModified('password')) { return; }
  var hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
