import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types/types";
// At it's simplest, the access control returns a yes or no value depending on the users session

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return session?.data.role?.[permission];
    },
  ])
) as Record<typeof permissionsList[number], (args: ListAccessArgs) => boolean>;

// Permissions check if someone meets a criteria - yes or no.
export const permissions = {
  ...generatedPermissions,
};

// Rule based function
// Rules can return a boolean - yes or no - or a filter which limits which products they can CRUD.
export const rules = {
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // Otherwise they may only update themselves!
    return { id: { equals: session!.itemId } };
  },

  canManageRoles({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageRoles({ session })) {
      return true;
    }
    // Otherwise they may only update themselves!
    return { id: { equals: session!.itemId } };
  },

  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // Otherwise they may only update themselves!
    return { id: { equals: session!.itemId } };
  },
};
