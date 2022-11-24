import { useRouter } from "next/router";
import { client, getProfile, getPublications } from "../../api";
import { useState, useEffect } from "react";
import Image from "next/image";
import abi from "../../abi.json";
import { ethers } from "ethers";

export default function Profile() {
    const router = useRouter()
    const { id } = router.query
    const [profile, setProfile] = useState()
    const [pubs, setPubs] = useState([])
    const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
    useEffect(() => {
        if (id) {
            fetchProfile()
        }
    }, [id])
    async function fetchProfile() {
        try {
            const response = await client.query(getProfile, { id }).toPromise()
            setProfile(response.data?.profile)
            const publicationData = await client.query(getPublications, { id }).toPromise()
            setPubs(publicationData.data.publications.items)
        } catch (error) {
            console.log(error)
        }
    }
    async function connect() {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })
        console.log({ accounts })
    }
    async function followUser() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address, abi, signer)
        try {
            const tx = await contract.follow([id], [0x0])
            await tx.wait()
            console.log("Followed user successfully...")
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <div>
            <div>
                <button onClick={connect}>Connect wallet</button>
            </div>
            {
                profile?.picture ? (
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
                <p>{profile?.bio}</p>
                <p>Followers: {profile?.stats.totalFollowers}</p>
                <p>Following: {profile?.stats.totalFollowing}</p>
                <div>
                    <button onClick={followUser}>Follow</button>
                </div>
            </div>
            <div>
                {
                    pubs.map((pub, index) => (
                        <div style={{ padding: "20px", borderTop: "1px solid black" }}>{pub.metadata?.content}</div>
                    ))
                }
            </div>
        </div>
    )
}