const ImagePicker = ({  }) => {

    // console.log(images)

    return (
        <div>
            <AddImageIcon />
        </div>
    )
}

const ImageObj = ({ img }) => {
    return (
        <div className="">
            <image></image>
        </div>
    )
}

const AddImageIcon = () => {
    return (
        <div className="container w-28 h-28 bg-slate-200 align-middle content-center">
            <div className="container w-20 h-20 bg-slate-300 align-middle content-center">
                <p className="text-2xl font-bold">+</p>
            </div>
        </div>
    )
}

export default ImagePicker