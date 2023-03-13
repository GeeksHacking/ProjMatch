const Landing = () => {


    return (
        <div className='w-full h-full'>
            {/* Header Bar */}
            <div className="flex flex-row relative w-full p-2">
                <span className="font-bold text-2xl text-logo-blue">ProjMatch</span>
                <div className="ml-auto space-x-3">
                    <button className="bg-light-blue p-2 rounded-lg text-white font-bold">Log In</button>
                    <button className="bg-light-blue p-2 rounded-lg text-white font-bold">Sign Up</button>
                </div>
            </div>
        </div>
    )
}

export default Landing