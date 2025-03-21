export default function PictureComponent() {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
            <div className="text-center">
                <img
                    src="food.jpeg"
                    alt="A beautiful scene"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                />
                <p className="mt-4 text-4xl font-bold text-gray-800">Can you see the picture?</p>
                <div className="mt-4 space-x-4">
                    <button className="px-5 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">Yes</button>
                    <button className="px-5 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">No</button>
                </div>
            </div>
        </div>
    );

}
