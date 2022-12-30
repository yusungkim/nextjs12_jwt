import type { GetServerSideProps, NextPage } from 'next'
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import useMutation from '../libs/client/useMutation';
import { UserDataResponse } from './api/auth/login';
import useUser from '../libs/client/useUser';
import { parseCookies } from 'nookies';

interface LoginFormData {
  email: string;
  password: string;
}

const Home: NextPage = (props) => {
  const { handleSubmit, register } = useForm<LoginFormData>()
  const [login, { loading: loginLoading, data }] = useMutation<UserDataResponse>('/api/auth/login')
  const [verifyMe, { loading: userLoading, user }] = useUser()
  const [accessTokenCheck, setAccessTokenCheck] = useState<string | null>(null)

  const onValid = (formData: LoginFormData) => {
    if (!loginLoading) {
      login(formData)
    }
  }

  useEffect(() => {
    if (data?.ok) {
      verifyMe()
      setAccessTokenCheck(null)
    }
  }, [data, verifyMe])

  const verifyAccessToken = async () => {
    // directly check access token
    const res = await fetch('/api/auth/me')
    setAccessTokenCheck(res.statusText)

    // update login status
    verifyMe()
  }
  
  const useRefreshToken = async () => {
    const res = await fetch('/api/auth/me?refresh=true')
    setAccessTokenCheck(res.statusText)
  }
  
  const logout = async () => {
    // remove cookies
    await fetch('/api/auth/logout', { method: 'POST' })

    // update login status
    verifyMe()
  }

  return (
    <>
      <main className="w-full h-full">
        <div className="flex flex-col w-full border-opacity-50">
          {!userLoading && user
            ? (
              <div className="mockup-code">
                <pre data-prefix="$"><code>login</code></pre>
                <pre data-prefix=">" className="text-success"><code>Welcome {user.name}</code></pre>
              </div>
            )
            : (<div className="grid card rounded-box place-items-center">
              <div className="hero">
                <div className="hero-content flex-col lg:flex-row-reverse">
                  <div className="card flex-shrink-0 w-full max-w-sm shadow-md bg-base-300">
                    <form className="card-body" onSubmit={handleSubmit(onValid)}>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>
                        <input {...register("email", { required: "Please input email address" })}
                          name="email" type="email" placeholder="email" className="input input-bordered" />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Password</span>
                        </label>
                        <input {...register("password", { required: "Password is required." })}
                          type="password" placeholder="password" className="input input-bordered" />
                        <label className="label">
                          <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                        </label>
                      </div>
                      <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary">{loginLoading ? "Submitting" : "Login"}</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>)}
          <div className="divider">AND</div>
          <div className="grid grid-cols-2 min-h-min p-3 card bg-base-300 rounded-box place-items-center gap-2">
            <button onClick={verifyAccessToken} className="btn btn-secondary">Verify Access Token</button>
            <button onClick={useRefreshToken} className="btn btn-accent">Use Refresh Token</button>
            <button onClick={logout} className="btn btn-outline btn-primary">Logout</button>
          </div>
          {accessTokenCheck &&
            <div className="w-full">
              <p>accessToken: {accessTokenCheck}</p>
            </div>
          }
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // only for demo purpose.
  // there is no need to manupulate cookie from the browser
  // fires only when the browser reloaded.
  const cookie = parseCookies(context) || {}
  return {
    props: {
      accessToken: cookie.accessToken || "",
      refreshToken: cookie.refreshToken || "",
    }
  }
}

export default Home
