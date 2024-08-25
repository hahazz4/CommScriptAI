import { Inter } from "next/font/google";
import React, { useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { FileUpload } from "@/components/ui/file-upload";
import { useTransC } from "@/context/tsContext";
import Link from "next/link";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";

// The page where user is prompted to upload their transcript in pdf format, and gets routed to /playground.
export default function ScriptArea(){
    const {setTransC} = useTransC();
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);

    const handleFileUpload = async (files: File[]) => {
        if (files.length > 0) {
            const formData = new FormData();
            formData.append("file", files[0]);
    
            const res = await fetch("/api/route", {
                method: "POST",
                body: formData,
            });
    
            if (res.ok) {
                const data = await res.json();
                setTransC(data.text);
                router.push("/playground");
            } else {
                console.error("Error uploading file:", res.statusText);
            }
        }
        // console.log(files);
    }

    return (
        <BackgroundBeamsWithCollision>
            <div className="container mx-auto justify-self-center">
                <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
                    Welcome!
                    <div className="relative mx-auto flex w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                        <div className="text-sm relative md:text-xl lg:text-2xl text-center bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-yellow-300 to-yellow-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                            <div className="">Drag or drop your transcript files here or click to upload.</div>
                            <FileUpload onChange={handleFileUpload}/>
                        </div>
                    </div>
                    <Link href="/playground">
                        <button className="text-lg p-[3px] relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-lg" />
                            <div className="px-8 py-2  bg-yellow hover:bg-black hover:text-white rounded-[6px]  relative group transition duration-200 text-black hover:bg-transparent">
                                Let's Go!
                            </div>
                        </button>
                    </Link>
                </h2>
            </div>
        </BackgroundBeamsWithCollision>
  );
}
