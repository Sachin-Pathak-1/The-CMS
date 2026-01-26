export function Announcements() {
    return (
        <div className="bg-white rounded-md h-full p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold my-3">Announcements</h1>
                <span className="text-xs text-gray-400">Veiw All</span>
            </div>
            <div className="flex flex-col gap-4">
                <div className="bg-blue-50 border border-gray-100 rounded-md p-3 border-l-4 border-l-blue-200">
                    <h1 className="font-semibold text-gray-600">Lorem ipsum dolor sit amet</h1>
                    <p className="mt-2 text-xs text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, pulvinar facilisis justo mollis, auctor consequat urna.</p>
                    <span className="text-xs text-gray-400">Posted on: 2023-10-01</span>
                </div>
                <div className="bg-purple-50 border border-gray-100 rounded-md p-3 border-l-4 border-l-purple-300">
                    <h1 className="font-semibold text-gray-600">Sed do eiusmod tempor</h1>
                    <p className="mt-2 text-xs text-gray-600">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <span className=" text-xs text-gray-400">Posted on: 2023-10-05</span>
                </div>
                <div className="bg-green-50 border border-gray-100 rounded-md p-3 border-l-4 border-l-green-200">
                    <h1 className="font-semibold text-gray-600">Duis aute irure dolor</h1>
                    <p className="mt-2 text-xs text-gray-600">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                    <span className="text-xs text-gray-400">Posted on: 2023-10-10</span>
                </div>
            </div>
        </div >
    );
} 