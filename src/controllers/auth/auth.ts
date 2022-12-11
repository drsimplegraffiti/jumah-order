import e, { Response, Request, NextFunction } from 'express';
import crypto from "crypto";
import { IUser } from '../../types/user';
import User from '../../models/user';
import sendEmail from '../../utils/mail';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



let refreshTokens: string[] = [];

const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {  // <--- Notice the return type of Promise<void> which means that this function will return a promise that will resolve to void (nothing)
    try {
        const body = req.body as Pick<IUser, 'name' | 'email' | 'password' | 'skills' | 'profile'>;  // <--- Pick is a generic type that allows you to select which properties you want to use from the IUser interface

        if (!(body.name && body.email && body.password)) {                  // <--- Notice the use of the "!" operator to check if the body.name, body.email and body.password are not undefined
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        if (body.password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters long' });
            return;
        }

        if (!body.email.includes('@')) {
            res.status(400).json({ message: 'Email must be valid' });
            return;
        }



        // check if user already exists
        const existingUser = await User.findOne({ email: body.email });

        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);


        const user: IUser = new User({  // <--- user:IUser is a type annotation that tells TypeScript that the user variable is of type IUser
            name: body.name,
            email: body.email,
            password: hashedPassword,
            skills: body.skills,
            profile: body.profile,
        });

        const newUser: IUser = await user.save();

        const token = jwt.sign(
            { user_id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        );

        const refreshToken = jwt.sign(
            { user_id: newUser._id, email: newUser.email },
            process.env.JWT_REFRESH_SECRET
        );

        refreshTokens.push(refreshToken);


        // send welcome email
        const options = {
            to: newUser.email,
            subject: 'Welcome to the app',
            text: `Welcome to the app, ${newUser.name}. Let me know how you get along with the app.`,
            html: `<p>Welcome to the app, ${newUser.name}. Let me know how you get along with the app.</p>`
        }

        // await sendEmail(options);



        res.status(201).json({ token, refreshToken });

    } catch (error) {
        next(error);
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = req.body as Pick<IUser, 'email' | 'password'>;

        if (!(body.email && body.password)) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }


        // Check if user exists in the database
        const user: IUser | null = await User.findOne({ email: body.email });

        if (user && (await bcrypt.compare(body.password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '5m' }
            );

            const refreshToken = jwt.sign(
                { user_id: user._id, email: user.email },
                process.env.JWT_REFRESH_SECRET
            );

            refreshTokens.push(refreshToken);
            console.log(refreshTokens)

            res.status(202).json({ token, refreshToken });
            return;
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
    } catch (error) {
        next(error);
    }
};


const refreshUserToken = async (
    req: Request,
    res: Response, next: NextFunction
): Promise<e.Response<any, Record<string, any>>> => {
    try {
        const { refresh } = req.body;
        if (!refresh) {
            return res.status(400).send("Refresh token not provided. Please enter one");
        }

        console.log(refreshTokens)
        if (!refreshTokens.includes(refresh)) {
            return res.status(403).send("Refresh Invalid. Please login.");
        }

        const decoded = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET);

        if (decoded) {
            const token = jwt.sign(
                { user_id: decoded.user_id, email: decoded.email },
                process.env.JWT_SECRET,
                { expiresIn: '2m' }
            );

            return res.status(200).json({ token });
        } else {
            return res.status(400).send("Invalid Credentials");
        }
    } catch (error) {
        throw error;
    }
};


const UserLogout = async (
    req: Request,
    res: Response, next: NextFunction
): Promise<e.Response<any, Record<string, any>>> => {
    try {
        const { refresh } = req.body;
        refreshTokens = refreshTokens.filter((token) => refresh !== token); // This will remove the token from the array of refresh tokens using the filter method 

        return res.status(200).send("User logged out successful");
    } catch (error) {
        throw error;
    }
};


const forgotPassword = async (
    req: Request,
    res: Response, next: NextFunction
): Promise<void> => {
    try {
        const { email } = req.body;

        const user: IUser | null = await User.findOne({ email });

        if (!user) {
            res.status(400).send("User does not exist");
            return;
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;


        const options = {
            to: user.email,
            subject: 'Reset your password',
            text: `Click the link below to reset your password: ${resetUrl}`,
            html: ` <a href=${resetUrl} clicktracking=off>${resetUrl}</a> `
        }

        await sendEmail(options);

        res.status(200).json({
            status: "success",
            message: "Password reset sent successfully"
        })

    } catch (error) {
        next(error);
    }
}


const resetPassword = async (
    req: Request,
    res: Response, next: NextFunction
): Promise<void> => {
    const { password } = req.body;

    const resetPasswordToken = crypto.createHash("sha256")
        .update(req.params.resetToken)
        .digest('hex');

    try {
        const user: IUser | null = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {
                $gt: Date.now(),
            }
        })

        if (!user) {
            res.status(400).send("Invalid Token");
            return;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        user.password = hashedPassword;
        user.resetPasswordToken = "";  // clear the resetPasswordToken and resetPasswordExpire fields
        user.resetPasswordExpire = "";
        await user.save();
        res.status(201)
            .json({
                success: true,
                data: "Password Reset successful"
            });


    } catch (error) {
        next(error);
    }
}



export { registerUser, loginUser, refreshUserToken, UserLogout, forgotPassword, resetPassword };