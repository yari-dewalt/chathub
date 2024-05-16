// @ts-nocheck
import deleteIcon from "../assets/delete.svg";

function ImagePreview({ image, removeImage }) {
  return (
    <div className="relative flex flex-col gap-1 min-w-48 min-h-48 max-w-48 p-2 bg-neutral-800 rounded">
      <button onClick={() => removeImage(image)} className="bg-neutral-700 hover:bg-[#4a4a4a] hover:shadow-md p-1 rounded absolute top-0 right-0">
        <img src={deleteIcon}></img>
      </button>
      <div className="grow bg-neutral-600 min-w-full rounded flex justify-center items-center">
        <img className="h-44 object-contain" src={image.src}></img>
      </div>
      <p className="self-start max-w-full text-xs text-neutral-300 text-nowrap overflow-x-hidden overflow-ellipsis">{image.name}</p>
    </div>
  )
}

export default ImagePreview;
