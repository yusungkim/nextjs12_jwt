// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import withMethodGuard from '../../../libs/server/withMethodGuard';
import { withApiSession } from '../../../libs/server/withSession';
import { destroyCookie } from 'nookies';


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ok: boolean}>
  ) {
    console.log("logout")

    // way1: use cookie directly for delivering tokens
    destroyCookie({res}, 'accessToken', { path: "/"})
    destroyCookie({res}, 'refreshToken', { path: "/"})
    
    // way2: use iron-session library for encrypted cookie delivery
    // req.session.accessToken = null
    // req.session.refreshToken = null
    // await req.session.save()
    
    return res.status(200).json({ok: true})
  }
  
export default withApiSession(withMethodGuard({ methods: ["POST"], handler }));