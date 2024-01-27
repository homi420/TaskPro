import Teams from "@models/Teams";
import connectToDb from "@utils/connectToDb";
import response from "@utils/response";

export const POST = async (req) => {
  await connectToDb();
  const { teamName, tags, description, creator } = await req.json();
  try {
    const teamExists = await Teams.find({ "headAdmin.id": creator });

    if (teamExists.name === teamName) {
      return response(409, "This team name is already taken!");
    } else {
      const newTeam = await Teams.create({
        name: teamName,
        members: [{ id: creator }],
        headAdmin: { id: creator },
        admins: [{ id: creator }],
        tags,
        description,
      });

      await newTeam.save();
      return response(200, "Team created successfully!");
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return response(500);
  }
};
