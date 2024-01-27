import Users from "@models/Users";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";
import crud from "mister-crud";
export const GET = async (req, { params }) => {
  await connectToDb();
  const { token } = params;
  try {
    if (!token) {
      return response(404, "Token not found!");
    }
    const customReq = {
      header: function (name) {
        return token;
      },
      user: undefined,
    };
    const customRes = {
      json: function (obj) {
        return response(400, obj);
      },
    };
    await crud.fetch(customReq, customRes, process.env.JWT_SECRET);
    const resp = await crud.getUser(customReq, Users);
    if (!resp.success) return response(400, resp);
    else return response(200, resp.user);
  } catch (error) {
    console.log(error);
    return response(500);
  }
};
