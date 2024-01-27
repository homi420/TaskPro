import mongoose from "mongoose";

const TeamsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Team Name is Required"],
  },
  tags: [{ type: String, required: true }],
  description: {
    type: String,
    required: [true, "Description Is Required"],
  },
  members: [{ id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" } }],
  headAdmin: { id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" } },
  admins: [{ id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" } }],
});
const Teams = mongoose.models.Teams || mongoose.model("Teams", TeamsSchema);
export default Teams;
