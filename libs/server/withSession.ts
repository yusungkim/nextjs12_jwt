import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { NextApiHandler } from "next";
import { UserData } from "../../database";

declare module "iron-session" {
  interface IronSessionData {
    accessToken: string;
    refreshToken: string;
  }
}

const ttl = process.env.SESSION_TTL_IN_SEC
  ? parseInt(process.env.SESSION_TTL_IN_SEC)
  : 60 * 60;

const sessionConfigs = {
  cookieName: process.env.APP_NAME! + "_session",
  password: process.env.SESSION_SECRET!,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
  ttl,
};

export function withApiSession(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionConfigs);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, sessionConfigs)
}