import Teams from "@models/Teams";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";

export const GET = async (req, { params }) => {
  const { id } = params;
  await connectToDb();
  try {
    if (!id) return response(409, { message: "No id received!" });
    const teams = await Teams.find({ "members.id": id });
    if (!teams) return response(409, { message: "Teams Not Found" });
    return response(200, { teams });
  } catch (error) {
    console.log(error);
    return response(500);
  }
};
