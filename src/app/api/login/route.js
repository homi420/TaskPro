import Users from "@models/Users";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";
import crud from "mister-crud";
export const POST = async (req) => {
  const { email, password } = await req.json();

  await connectToDb();
  try {
    if (!email || !password) {
      return response("Fields are required", 400);
    }
    const resp = await crud.login(
      { body: { email, password } },
      Users,
      process.env.JWT_SECRET
    );
    if (!resp.success) return response(400, resp);
    else return response(200, resp);
  } catch (error) {
    console.log(error);
    return response(500);
  }
};
