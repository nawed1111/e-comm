import mongoose from 'mongoose';

import { Password } from '../services/Password';

// An interface that describes the properties
//that are required to create a new user
interface UserAttrs {
  fname: string;
  lname: string;
  email: string;
  password: string;
  isValidPassword(): boolean;
}

//An interface that describes the properties
//that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//An interface that describes the properties
//that a User Document has
interface UserDoc extends mongoose.Document {
  [x: string]: any;
  fname: string;
  lname: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  try {
    if (this.isModified('password')) {
      const hashed = await Password.toHash(this.get('password'));
      this.set('password', hashed);
    }
    done();
  } catch (error) {
    done(error);
  }
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.methods.isValidPassword = async function (password: string) {
  try {
    return Password.compare(this.get('password'), password);
  } catch (error) {
    error.message = 'Wrong password. Please try again.';
    throw error;
  }
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
