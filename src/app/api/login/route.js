import Users from "@models/Users";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
export const POST = async (req) => {
  const { email, password } = await req.json();

  await connectToDb();
  try {
    if (!email || !password) {
      return response("Fields are required", 400);
    }
    const user = await Users.findOne({ email });
    if (!user) return response(404, { message: "User not found!" });
    const userPassword = await bcrypt.compare(password, user.password);
    if (!userPassword)
      return response(400, { message: "Incorrect credentials!" });
    const data = { user: { id: user._id } };
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = sign(data.user, JWT_SECRET);
    return response(200, { message: "LoggedIn Successful!", token });
  } catch (error) {
    console.log(error);
    return response(500);
  }
};
