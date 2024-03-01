
import { randomBytes } from 'crypto';
import { createAuth } from '@keystone-6/auth';
import { permissionsList } from "./schemas/fields";

import { statelessSessions } from '@keystone-6/core/session';

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== 'production') {
  sessionSecret = randomBytes(32).toString('hex');
}

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: {
      isInitialUser: true,
    },
  },
  sessionData: `id name email role { ${permissionsList.join(" ")} }`,
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      // await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});


const sessionMaxAge = 60 * 60 * 24 * 30;

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
});

export { withAuth, session };
