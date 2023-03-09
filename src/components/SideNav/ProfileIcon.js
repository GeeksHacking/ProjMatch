export default function CreateIcon() {
    return (
        <a className='flex items-center flex-row space-x-2'>
            <img src="/IconsProfile.jpg" alt="logo" className='w-14 h-14 flex-shrink-0 rounded-full border-2 border-logo-blue'></img>
            {/* <span className='font-bold text-xl flex items-center pb-0.5'> Create </span> */}
            <div className="flex items-start flex-col">
                <span className='font-bold text-lg text-logo-blue translate-y-0.5'> MrJohnDoe </span>
                <span className='font-bold text-lg text-start -translate-y-0.5'> John Doe </span>
            </div>
        </a>
    );
};