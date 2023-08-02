import styles from "./ImagePicker.module.css";
import { useEffect, useState } from "react";

const ImagePicker = ({ images, sendToParent }) => {
	const [imgs, setImgs] = useState([]);

	useEffect(() => {
		setImgs(images);
	}, []);

	const handleSubmission = (e) => {
		const rawFiles = [...e.target.files];
		let fileURLs = [];

		for (let i = 0; i < rawFiles.length; i++) {
			const fileURL = URL.createObjectURL(rawFiles[i]);
			if (fileURL !== undefined) {
				fileURLs.push(fileURL);
			} else {
				console.error("Could not convert file to URL");
			}
		}

		let temp = imgs.concat(fileURLs);
		setImgs(temp);
		sendToParent(imgs.concat(rawFiles));
	};

	const deleteImage = (img) => {
		let temp = imgs;
		const index = temp.indexOf(img);

		temp.splice(index, 1);
		setImgs(temp);
	};

	return (
		<div className="flex flex-row gap-4 pt-4">
			{imgs.map((img) => (
				<div
					className={`${styles.addedImage} group relative overflow-hidden rounded-xl`}
					id={img}
				>
					<img className="h-full w-full object-cover" src={img}></img>
					<div
						className={`group absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/0 duration-150 hover:bg-white/40`}
					>
						<button
							onClick={() => deleteImage(img)}
							className="rounded-full bg-delete-red p-1 px-2 text-white opacity-0 duration-150 group-hover:opacity-100"
						>
							Delete
						</button>
					</div>
				</div>
			))}

			<div
				className={`bg-slate-200 ${styles.addParent} duration-150 hover:scale-105 active:scale-95`}
			>
				<form onChange={handleSubmission}>
					<div className={`bg-slate-300 ${styles.addChild}`}>
						<p className="text-2xl font-bold">+</p>
					</div>
					<input
						multiple
						type="file"
						name="imageInput"
						className={`${styles.inputImage}`}
					></input>
				</form>
			</div>
		</div>
	);
};

export default ImagePicker;
