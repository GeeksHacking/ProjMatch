export default function Logo() {
    return (
        <a className='flex items-center space-x-2 text-logo-blue'>
            <img src="/logo.svg" alt="logo" className='w-11 h-11 flex-shrink-0'></img>
            <span className='font-bold text-lg'> ProjMatch </span>
        </a>
    );
};