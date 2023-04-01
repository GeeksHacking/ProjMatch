import SideNav from "@/components/SideNav/SideNav"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Link from "next/link"

export default function Home() {
    return (
        <main className='w-full h-full flex flex-row'>
            <div className='grow'>
                <SideNav /> 
            </div>

            <div className='flex h-full shrink items-center'>
                <div className='post-alignment'>
                    
                </div>
            </div>
        </main>
    )
}

export const getServerSideProps = withPageAuthRequired()