import SideNav from "@/components/SideNav/SideNav"
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