import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
     res.status(200).json(new ApiResponse(true, "User registered successfully", {}));
} )


export {
    registerUser,
}