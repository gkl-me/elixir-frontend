export default function CodeDesign(){
    return (
        <>
            <div className="w-60 md:w-96 bg-navy rounded-lg p-4 shadow-lg">
        <div className="flex space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>

        <div className="space-y-3 ">
            <div className="h-4 bg-blueDark rounded w-3/4"></div>
            <div className="h-4 bg-blueDark rounded w-2/4"></div>
            <div className="h-4 bg-blueDark rounded w-3/5"></div>
            <div className="h-4 bg-blueDark rounded w-4/5"></div>
            <div></div>
        </div>
  </div>
        </>
    )
}