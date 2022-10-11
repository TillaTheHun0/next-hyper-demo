/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'

import type { User } from '../lib/domain/models/user'
import { withMiddlewareSsr } from '../lib/middleware'

export const getServerSideProps = withMiddlewareSsr(async (context) => {
  const {
    req: {
      domain: {
        apis: { Onboarding }
      }
    }
  } = context

  const [users, tally] = await Promise.all([Onboarding.getUsers(), Onboarding.colorTally()])

  return { props: { users: JSON.parse(JSON.stringify(users)), tally } }
})

const Home: NextPage<{ users: User[]; tally: Record<string, number> }> = ({
  users: data,
  tally: initialTally
}) => {
  const [users, setUsers] = useState(data)
  const [tally, setTally] = useState(initialTally)

  async function addUser() {
    return toast
      .promise(fetch('/api/users', { method: 'POST' }), {
        loading: 'Adding...',
        success: 'Success!',
        error: 'Error adding user'
      })
      .then((res) => res.json())
      .then((user) => setUsers([...users, user]))
      .then(() => getTally())
  }

  async function getTally() {
    return toast
      .promise(fetch('/api/colors'), {
        loading: 'Refetching Tally...',
        success: 'Success!',
        error: 'Error fetching tally'
      })
      .then((res) => res.json())
      .then((tally) => setTally(tally))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Hyper Next</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col bg-gray-200 px-4 pb-4">
        <div className="navbar mt-4 items-center justify-between space-x-4 bg-gray-200">
          <div className="flex-none">
            <h3>Users</h3>
          </div>

          <div className="stats shadow">
            {Object.keys(tally).map((t) => (
              <div className="stat" key={t}>
                <div className="stat-title">{t}</div>
                <div className="stat-value">{tally[t]}</div>
              </div>
            ))}
          </div>

          <div className="mt-2 w-full md:w-40">
            <button className="btn btn-primary" onClick={addUser}>
              Add User
            </button>
          </div>
        </div>
        <div className="divider" />
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Favorite Color</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.email}>
                  <th>{i}</th>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={user.avatarUrl} alt="Avatar" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.name}</td>
                  <td>{user.favoriteColor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  )
}

export default Home
