import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in env");
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode?.userId) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.id = decode.userId;
        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }
};

export default isAuthenticated;
