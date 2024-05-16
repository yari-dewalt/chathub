// @ts-nocheck
import ImagePreview from "./ImagePreview";

function ImagesArea({ images, removeImage }) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto">
      {images.map((image, index) =>
        <ImagePreview key={index} image={image} removeImage={removeImage}/>
      )}
    </div>
  )
}

export default ImagesArea;
