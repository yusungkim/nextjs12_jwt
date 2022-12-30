// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import withMethodGuard from '../../../libs/server/withMethodGuard';
import { withApiSession } from '../../../libs/server/withSession';
import { parseCookies, setCookie } from 'nookies';
import { sign, verify } from "jsonwebtoken"
import { accessExpiresIn, cookieOptions, UserDataResponse } from './login';
import { UserData } from '../../../database';

const secret = process.env.JWT_SECRET!;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDataResponse>
) {
  const cookie = parseCookies({req})
  const { refresh } = req.query

  if (refresh) {
    console.log("refresh access token")
    try {
      const {id, email, name} = verify(cookie.refreshToken, secret) as UserData
      const accessToken = sign({id, email, name}, secret, { expiresIn: accessExpiresIn })
      
      // way1: use cookie directly for delivering tokens
      setCookie({res}, 'accessToken', accessToken, cookieOptions)

      // way2: with encrypted cookie
      // req.session.accessToken = accessToken
      // await req.session.save()
      
      return res.status(200).json({ok: true, user: {id, email, name}})

    } catch (error) {
      console.log(error)
      return res.status(401).json({ok: false})
    }
  }

  // verify access token
  console.log("verify access token")
  try {
    const userInfo = verify(cookie.accessToken, secret) as UserData
    if (userInfo) {
      return res.status(200).json({ok: true, user: userInfo})
    }
  } catch (error) {
    // TokenExpiredError
    return res.status(401).json({ok: false})
  }
  
  res.status(401).json({ok: false})
}

export default withApiSession(withMethodGuard({ methods: ["GET"], handler }));