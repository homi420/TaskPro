import response from "@utils/response";
import { verify } from "jsonwebtoken";
const fetch = async (token, JWT_SECRET) => {
  const data = verify(token, JWT_SECRET);
  if (!data) return response(400, { message: "Invalid Token" });
  return data.id;
};
export default fetch;
