import colorsUtils from "../helpers/colorsUtils";
import { RoleModel } from "../database/model/Role";

const seedRoles = async () => {
  const roles = [
    {
      code: "ADMIN",
    },
    {
      code: "USER",
    },
  ];

  try {
    const existingRoles = await RoleModel.find();
    if (!existingRoles.length) {
      await RoleModel.insertMany(roles);
      colorsUtils.log("success", "Roles seeded successfully");
    } else {
      colorsUtils.log("info", "Roles already exists");
    }
  } catch (error) {
    colorsUtils.log("error", "Roles seeding failed");
  }
};

export default seedRoles;
