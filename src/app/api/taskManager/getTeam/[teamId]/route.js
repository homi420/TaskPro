import Teams from "@models/Teams";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";

export const GET = async (req, { params }) => {
  const { teamId } = params;
  await connectToDb();
  try {
    const team = await Teams.findById(teamId)
      .populate("headAdmin.id")
      .populate("admins.id")
      .populate("members.id");
    if (!team) {
      return response(404, "No team found");
    } else {
      return response(200, team);
    }
  } catch (error) {
    return response(500);
  }
};
