import mongoose from "mongoose";
import bcrypt from "bcryptjs";




const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  }
}, {
  timestamps: true
});

// const userSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required: true,
//         trim: true,
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true,
//         lowercase: true,
//     },
//     password: {
//         type:String,
//         required:true,
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now,
//     },
// });


//password encryption here

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err); // 👈 important to pass error to next
  }
});

//comparing entered password with hashed

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

const User = mongoose.model("User",userSchema);

export default User;



