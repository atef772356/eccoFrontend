import React from "react";

export default function SkeltonProduct() {
  return (
    <div className="flex flex-col gap-5">
      <div className="w-[400px] h-[35px]  bg-slate-200 animate-pulse"></div>
      <div className="w-[70px] h-[35px] bg-slate-200 animate-pulse"></div>
      <div className="w-[400px] h-[35px] bg-slate-200 animate-pulse"></div>
      <div className="w-[400px] h-[35px] bg-slate-200 animate-pulse"></div>
      <div className="w-[400px] h-[35px] bg-slate-200 animate-pulse"></div>
      <div className="w-[100px] h-[35px] bg-slate-200 animate-pulse"></div>
    </div>
  );
}
