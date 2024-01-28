import Users from "@models/Users";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";
import bcrypt from "bcrypt";
export const POST = async (req) => {
  await connectToDb();
  const { userName, email, password } = await req.json();

  try {
    if (!userName || !email || !password)
      return response(400, "Fields Can not be empty!");
    const user = await Users.findOne({ email });
    if (user) return response(409, { message: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await Users.create({
      userName,
      email,
      password: hashedPassword,
    });
    if (!newUser) return response(400, { message: "Registration Failed!" });
    return response(200, { message: "User Registered!" });
  } catch (error) {
    console.log(error);
    return response(500);
  }
};
