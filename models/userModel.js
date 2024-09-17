import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      validate: {
        validator: function (value) {
          const passwordPattern =
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
          return passwordPattern.test(value);
        },
        message:
          "Password must be at least 6 characters long, and include at least one letter, one number, and one special character.",
      },
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
