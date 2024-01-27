import Teams from "@models/Teams";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";
export const GET = async (req, { params }) => {
  const { owner } = params;
  await connectToDb();
  try {
    const teams = await Teams.find({ "headAdmin.id": owner })
      .populate("members.id")
      .populate("admins.id");
    if (teams.length === 0) {
      return response(404, "No team Found");
    } else {
      return response(200, teams);
    }
  } catch (error) {
    return response(500);
  }
};
