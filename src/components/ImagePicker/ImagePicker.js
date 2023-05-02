import styles from "./ImagePicker.module.css"

const ImagePicker = ({ images }) => {
    return (
        <div className="flex flex-row gap-4 pt-4">
            {
                images.map(img => (
                    <ImageObj img={img} />
                ))
            }
            <AddImageIcon />
        </div>
    )
}

const ImageObj = ({ img }) => {

    const onClickImage = () => {

    }

    return (
        <div className={`${styles.addedImage}`}>
            <img src={img}></img>
            <div className={`${styles.imageHoverContainer}`}>
                <button>Delete</button>
            </div>
        </div>
    )
}

const AddImageIcon = () => {

    const doOnClick = () => {
        console.log("Cicked")
    }

    return (
        <div className={`bg-slate-200 ${styles.addParent}`}>
            <div className={`bg-slate-300 ${styles.addChild}`} onClick={doOnClick}>
                <p className="text-2xl font-bold">+</p>
            </div>
            {/* <input type="file" name="imageInput" className={`${styles.inputImage}`}></input> */}
        </div>
    )
}

export default ImagePicker