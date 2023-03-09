export default function Logo() {
    return (
        <a className='flex items-center space-x-2 text-logo-blue'>
            <img src="/logo.svg" alt="logo" className='w-12 h-12 flex-shrink-0'></img>
            <span className='font-bold text-xl'> ProjMatch </span>
        </a>
    );
};