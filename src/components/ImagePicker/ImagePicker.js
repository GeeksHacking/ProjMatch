import styles from "./ImagePicker.module.css"
import { useEffect, useState } from "react"

const ImagePicker = ({ images, sendToParent }) => {

    const [ imgs, setImgs ] = useState([])

    useEffect(() => {
        setImgs(images)
    }, [])

    const handleSubmission = (e) => {
        const rawFiles = [...e.target.files]
        let fileURLs = []

        for (let i = 0; i < rawFiles.length; i++) {
            const fileURL = URL.createObjectURL(rawFiles[i])
            if (fileURL !== undefined) {
                fileURLs.push(fileURL)
            } else {
                console.error("Could not convert file to URL")
            }
        }

        let temp = imgs.concat(fileURLs)
        setImgs(temp)
        sendToParent(imgs.concat(rawFiles))
    }

    const deleteImage = (img) => {
        let temp = imgs
        const index = temp.indexOf(img)

        temp.splice(index, 1)
        setImgs(temp)
    }

    return (
        <div className="flex flex-row gap-4 pt-4">
            {
                imgs.map(img => (
                    <div className={`${styles.addedImage}`} id={img}>
                        <img src={img}></img>
                        <div className={`${styles.imageHoverContainer}`}>
                            <button onClick={() => deleteImage(img)}>Delete</button>
                        </div>
                    </div>
                ))
            }

            <div className={`bg-slate-200 ${styles.addParent}`}>
                <form onChange={handleSubmission}>
                    <div className={`bg-slate-300 ${styles.addChild}`}>
                        <p className="text-2xl font-bold">+</p>
                    </div>
                    <input multiple type="file" name="imageInput" className={`${styles.inputImage}`}></input>
                </form>
            </div>
        </div>
    )
}

export default ImagePicker