import mongoose from 'mongoose';
import validate from 'mongoose-validator';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt-nodejs';

const emailValidator = [
  validate({
    validator: 'isEmail',
    arguments: [{allow_display_name: false, require_tld: true }],
    message: 'A properly formatted email address is required to create an account'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 300],
    message: 'Email is required, and must be less than {ARGS[1]} characters'
  })
];

const passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [8, 72],
    message: 'Password must be at least {ARGS[0]} and less than {ARGS[1]} characters'
  })
];

const userSchema = new Schema({
  email: { type: String, index: { unique: true, dropDups: true }, validate: emailValidator },
  password: { type: String, validate: passwordValidator },
  created_at: Date,
  updated_at: Date
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) { return next(); }
  this.password = bcrypt.hashSync(this.password);
  next();
});

userSchema.pre('save', function(next) {
  this.email = this.email && this.email.toLowerCase();
  next();
});

userSchema.pre('save', function(next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

userSchema.methods.authenticate = function(suppliedPassword) {
  return bcrypt.compareSync(suppliedPassword, this.password);
};

export default mongoose.model('User', userSchema);
