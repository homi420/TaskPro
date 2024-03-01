// pages/api/getUser/[token].js

import Users from "@models/Users";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";
import { verify } from "jsonwebtoken";

// Define the function to generate static paths
export async function generateStaticPaths() {
  // Fetch possible values for the dynamic parameter `token`
  // For example, you might query your database to get the list of all valid tokens
  const possibleTokens = await fetchPossibleTokens(); // Implement this function
  // Return an array of objects containing the `params` property
  // with the possible values for the dynamic parameter(s)
  return possibleTokens.map((token) => ({
    params: { token },
  }));
}

// Define the API route handler
export const GET = async (req, { params }) => {
  await connectToDb();
  const { token } = params;
  try {
    if (!token) return response(404, "Token not found!");
    const JWT_SECRET = process.env.JWT_SECRET;
    const data = verify(token, JWT_SECRET);
    if (!data) return response(400, { message: "Invalid Token" });
    const userId = data.id;
    const user = await Users.findById(userId).select("-password");
    return response(200, { message: "User found!", user });
  } catch (error) {
    console.log(error);
    return response(500);
  }
};

// Function to fetch possible tokens from the database
async function fetchPossibleTokens() {
  // Implement your logic to fetch the list of possible tokens
  // For example, you might query your database to get all valid tokens
}
