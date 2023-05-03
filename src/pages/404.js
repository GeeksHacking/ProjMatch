import SideNav from "@/components/SideNav/SideNav"

const PageNotFound = () => {
    return (
        <div className='absolute flex w-full h-full flex-col justify-start items-center'>
            <SideNav />
            <div className='absolute flex w-[70%] h-full flex-col justify-start items-start my-10'>
                <h1>Whoops!</h1>
                <h3>We could not find what you were looking for! Go back to <a href="localhost:3000/Home">Home</a>.</h3>
            </div>
        </div>
    )
}

export default PageNotFound