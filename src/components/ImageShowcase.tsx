// @ts-nocheck
function ImageShowcase({ image, onClose }) {
  function handleClick(e) {
    if (!e.target.matches("img")) {
      onClose();
    }
  }

  return (
    <div onClick={handleClick} className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70 z-50">
      <img src={image} className="max-w-full max-h-full"/>
    </div>
  );
}

export default ImageShowcase;
