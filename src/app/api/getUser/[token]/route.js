import Users from "@models/Users";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";
import { verify } from "jsonwebtoken";

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
    return response(200, { message: "User founded!", user });
  } catch (error) {
    console.log(error);
    return response(500);
  }
};
