import { Inter } from "next/font/google";
import React, { useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { FileUpload } from "@/components/ui/file-upload";
import { useTransC } from "@/context/tsContext";
import Link from "next/link";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";

// This page is where the magic happens, user sees the pdf in a view box, can add comments, attach files to a comment.
// They can also generate a overview/summarization of the entire transcript and the comments associated with a click of a button.
export default function ActionArea(){
    const {transC} = useTransC();
    const router = useRouter();
    const [selectTxt, setSelectTxt] = useState<string | null>(null)

    //logic for commenting the pdf
    const handleCommLogic = () =>{
        const select = window.getSelection();
        const selectTxt = select?.toString();
        if (selectTxt)
            setSelectTxt(selectTxt)
    }

    return (
        <BackgroundBeamsWithCollision>
            <div className="container mx-auto justify-self-center">
                <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
                    Playground
                    <div className="relative mx-auto flex w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                        <div className="text-sm relative md:text-xl lg:text-2xl text-center bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-yellow-300 to-yellow-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                            <div className="">Add comments, once done, click finish.</div>
                            <div className="">A concise overview of the transcript and associated comments will be generated for your convenience.</div>
                            <div className="">
                                {transC ? (
                                    <p>{transC}</p>
                                ):(
                                    <p>Sorry no transcript here, please upload a transcript!</p>
                                )}
                                {selectTxt && <div>Text selected: {selectTxt}</div>}
                            </div>
                        </div>
                    </div>
                </h2>
            </div>
        </BackgroundBeamsWithCollision>
  );
}
