import { Document } from "mongoose";

// create enum for skills
enum Skills {
    softwareDevelopment = "software development",
    webDevelopment = "web development",
    mobileDevelopment = "mobile development",
    design = "design",
    management = "management",
    other = "other",
}


// create interface for user model and export it to be used in other files
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    resetPasswordExpire: string;
    resetPasswordToken: string;
    getResetPasswordToken: () => string;
    skills: Skills[];
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        bio: String,
        phone: String,
        gender: String,
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            zip: String,
            location: String,
        },
        active: true

    }
}

