export default function Logo({fullSideNav}) {
    return (
        <a className={`flex items-center space-x-2 text-logo-blue pl-3 pr-3`}>
            <img src="/logo.svg" alt="logo" className='w-12 h-12 flex-shrink-0'></img>
            { fullSideNav ? <span className='font-bold text-xl'> ProjMatch </span> : <></> }
        </a>
    );
};