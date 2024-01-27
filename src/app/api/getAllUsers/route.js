import Users from "@models/Users";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";

export const GET = async (req) => {
  try {
    await connectToDb();
    const users = await Users.find().select("-password");
    if (users) {
      return response(200, users);
    }
  } catch (error) {
    return response(500);
  }
};
