// @ts-nocheck
function DeleteModal({ deleteMessage, cancel}) {
  return (
    <div className="absolute top-0 z-10 left-0 flex justify-center items-center min-h-screen w-screen bg-opacity-30 bg-black">
      <div className="shadow-xl z-20 flex flex-col p-6 gap-6 rounded items-center border-2 border-neutral-800 bg-neutral-700 pointer-events-auto">
        <h2 className="text-xl text-white font-bold">Are you sure you want to delete this message?</h2>
        <div className="flex gap-6">
          <button onClick={deleteMessage} className="text-neutral-300 hover:text-white font-bold bg-red-500 p-2 rounded border-2 border-transparent hover:border-white transition-color duration-200">Delete</button>
          <button onClick={cancel} className="font-bold bg-white p-2 rounded border-2 border-transparent hover:border-white bg-opacity-70 transition-color duration-200">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal;
