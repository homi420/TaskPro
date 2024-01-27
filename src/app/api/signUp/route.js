import Users from "@models/Users";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";
import crud from "mister-crud";
export const POST = async (req) => {
  await connectToDb();
  const { userName, email, password } = await req.json();
  // console.log(userName);
  // console.log(email);
  // console.log(password);

  try {
    if (!userName) return response(400, "Fields Can not be empty!");
    const resp = await crud.signUp(
      { body: { userName, email, password } },
      Users
    );
    if (resp !== undefined) {
      if (!resp?.success) return response(400, resp);
    } else {
      return response(200, {
        success: true,
        message: "Registered Successfully!",
      });
    }
  } catch (error) {
    console.log(error);
    return response(500);
  }
};
