// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import db from "../../../database"
import type { UserData } from "../../../database"
import withMethodGuard from '../../../libs/server/withMethodGuard';
import { withApiSession } from '../../../libs/server/withSession';
import { setCookie } from 'nookies';
import { sign } from "jsonwebtoken"

const secret = process.env.JWT_SECRET!;

export interface UserDataResponse {
  ok: boolean;
  user?: UserData;
}

const refreshExpiresIn = parseInt(process.env.SESSION_TTL_IN_SEC!)
export const accessExpiresIn = 60
export const cookieOptions = {
  httpOnly: true,
  maxAge: refreshExpiresIn, 
  secure: process.env.NODE_ENV == "production",
  path: '/'
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDataResponse>
) {
  const { email, password } = req.body
  
  const registeredUser =  db.users.filter(user => user.email == email)

  if (registeredUser.length == 1) {
    const {password: dbPassword, ...userInfo} = registeredUser[0]
    if(dbPassword == password) {
      const accessToken = sign(userInfo, secret, { expiresIn: accessExpiresIn })
      const refreshToken = sign(userInfo, secret, { expiresIn: refreshExpiresIn })
      
      // way1: use cookie directly for delivering tokens
      setCookie({res}, 'accessToken', accessToken, cookieOptions)
      setCookie({res}, 'refreshToken', refreshToken, cookieOptions)

      // way2: use iron-session library for encrypted cookie delivery
      // req.session.accessToken = accessToken
      // req.session.refreshToken = refreshToken
      // await req.session.save()

      return res.status(200).json({ok: true, user: userInfo})
    } else {
      return res.status(404).json({ok: false})    
    }
  }

  res.status(404).json({ok: false})
}

export default withApiSession(withMethodGuard({ methods: ["POST"], handler }));