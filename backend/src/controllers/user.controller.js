import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { validateEmail, validatePassword, validateRequiredFields, sanitizeInput } from "../utils/validation.js";
import jwt from "jsonwebtoken";

// Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// ============ AUTHENTICATION CONTROLLERS ============

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    // Validate required fields
    validateRequiredFields(['fullName', 'email', 'password'], req.body);

    // Sanitize inputs
    const sanitizedFullName = sanitizeInput(fullName);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        throw new ApiError(400, passwordValidation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // Create user
    const user = await User.create({
        fullName: sanitizedFullName,
        email: sanitizedEmail,
        password
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Get created user without password and refreshToken
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    res.status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                201,
                {
                    user: createdUser,
                    accessToken,
                    refreshToken
                },
                "User registered successfully"
            )
        );
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    validateRequiredFields(['email', 'password'], req.body);

    // Sanitize email
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Find user
    const user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Check if account is active
    if (!user.isActive) {
        throw new ApiError(403, "Your account has been deactivated. Please contact administrator.");
    }

    // Verify password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Get user without sensitive data
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        )
    );
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// ============ USER PROFILE MANAGEMENT ============

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    
    res.status(200).json(
        new ApiResponse(200, user, "Profile fetched successfully")
    );
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName && !email) {
        throw new ApiError(400, "At least one field (fullName or email) is required");
    }

    const updateData = {};

    if (fullName) {
        const sanitizedFullName = sanitizeInput(fullName);
        if (sanitizedFullName.length < 2) {
            throw new ApiError(400, "Full name must be at least 2 characters");
        }
        updateData.fullName = sanitizedFullName;
    }

    if (email) {
        const sanitizedEmail = sanitizeInput(email).toLowerCase();
        
        // Validate email format
        if (!validateEmail(sanitizedEmail)) {
            throw new ApiError(400, "Invalid email format");
        }

        // Check if email is already taken by another user
        const existingUser = await User.findOne({ 
            email: sanitizedEmail,
            _id: { $ne: req.user._id }
        });

        if (existingUser) {
            throw new ApiError(409, "Email is already in use");
        }

        updateData.email = sanitizedEmail;
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    res.status(200).json(
        new ApiResponse(200, user, "Profile updated successfully")
    );
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    validateRequiredFields(['currentPassword', 'newPassword'], req.body);

    // Get user with password
    const user = await User.findById(req.user._id);

    // Verify current password
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Current password is incorrect");
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
        throw new ApiError(400, passwordValidation.errors.join(', '));
    }

    // Check if new password is same as current password
    if (currentPassword === newPassword) {
        throw new ApiError(400, "New password must be different from current password");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    );
});

// ============ ADMIN CONTROLLERS ============

// Get All Users (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    
    if (req.query.isActive) {
        filter.isActive = req.query.isActive === 'true';
    }

    if (req.query.role) {
        filter.role = req.query.role;
    }

    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        filter.$or = [
            { fullName: searchRegex },
            { email: searchRegex }
        ];
    }

    // Get users
    const users = await User.find(filter)
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Get total count
    const totalUsers = await User.countDocuments(filter);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                users,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalUsers / limit),
                    totalUsers,
                    limit
                }
            },
            "Users fetched successfully"
        )
    );
});

// Activate User (Admin)
const activateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isActive) {
        throw new ApiError(400, "User is already active");
    }

    user.isActive = true;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, user, "User activated successfully")
    );
});

// Deactivate User (Admin)
const deactivateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot deactivate your own account");
    }

    if (!user.isActive) {
        throw new ApiError(400, "User is already deactivated");
    }

    user.isActive = false;
    // Clear refresh token when deactivating
    user.refreshToken = undefined;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, user, "User deactivated successfully")
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    refreshAccessToken,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAllUsers,
    activateUser,
    deactivateUser
}