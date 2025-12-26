
import { SetMetadata } from "@nestjs/common";
import { DefaultRole } from "../utils/enums/role.enum";

export const Roles = (...roles: DefaultRole[]) => SetMetadata('roles', roles);
