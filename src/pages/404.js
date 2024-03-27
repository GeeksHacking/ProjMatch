import Link from "next/link"

const PageNotFound = () => {
    return (
        <div className='absolute flex w-full h-full flex-col justify-center items-center'>
            <div className="flex flex-col max-w-md gap-7">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-7xl font-medium">404</h1>
                    <h2 className="text-2xl font-light">Page not Found</h2>
                </div>
                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="italic">Oops! We search far and wide but there's nothing here... Did you type the correct link?</p>
                    <Link href="/">
                        <button className="bg-logo-lblue hover:bg-logo-blue px-6 py-3 rounded-3xl text-white duration-400">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound
