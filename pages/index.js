import Head from 'next/head'
import { useEffect, useState } from 'react'
import { client, recommendProfiles } from '../api'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {

  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    fetchProfiles()
  }, [])
  
  async function fetchProfiles() {
    try {
      const response = await client.query(recommendProfiles).toPromise()
      setProfiles(response.data?.recommendedProfiles)
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <div>
      <Head>
        <title>Lens app</title>
        <meta name="description" content="Lens app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {
          profiles.map((profile, index) => (
              <Link href={`/profile/${profile?.id}`}>
              {
                profile.picture ? (
                  <Image
                    src={profile.picture.original?.url}
                    alt=""
                    width={200}
                    height={200} />
                ) : (
                  <div style={{ width: "60px", height: "60px", backgroundColor: "black", borderRadius: "60px" }} />
                )
              }
              <div>
                <h4>{profile?.handle}</h4>
                <h4>{profile?.bio}</h4>
              </div>
            </Link>
          ))
        }
      </main>
    </div>
  )
}
