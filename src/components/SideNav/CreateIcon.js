export default function CreateIcon() {
    return (
        <a className='flex items-center space-x-2 text-light-blue bg-logo-blue w-full h-fit rounded-lg'>
            <img src="/IconsCreate.svg" alt="logo" className='w-8 h-8 flex-shrink-0 ml-2 my-2'></img>
            <span className='font-bold text-xl flex items-center pb-0.5'> Create </span>
        </a>
    );
};