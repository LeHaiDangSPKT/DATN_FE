import React from 'react'

function LoadingPopup() {
    return (
        <div className="relative flex justify-center items-center animate-pulse p-2 ml-1">
            <div className="w-[54px] h-[54px] rounded-full bg-slate-400"></div>
            <div className="flex-1 ml-3">
                <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg"></div>
                <div className="h-5 w-[100%] rounded-lg bg-slate-400 text-sm"></div>
            </div>
        </div>
    )
}

export default LoadingPopup