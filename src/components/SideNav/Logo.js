export default function Logo({showFullNav}) {
    return (
        <a className={`flex items-center space-x-2 text-logo-blue ${showFullNav ? "pl-3 pr-3" : ""}`}>
            <img src="/logo.svg" alt="logo" className='w-12 h-12 flex-shrink-0'></img>
            {showFullNav ? <span className='font-bold text-xl'> ProjMatch </span> : <></>}
        </a>
    );
};