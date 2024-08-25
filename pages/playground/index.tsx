import { Inter } from "next/font/google";
import React, { useState, useRef } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { FileUpload } from "@/components/ui/file-upload";
import { useTransC } from "@/context/tsContext";
import Link from "next/link";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import PDFParser from "pdf2json";
import { text } from "stream/consumers";

// This page is where the magic happens, user sees the pdf in a view box, can add comments, attach files to a comment.
// They can also generate a overview/summarization of the entire transcript and the comments associated with a click of a button.
export default function Playground(){
    const {setTransC, transC} = useTransC();
    const router = useRouter();
    const transCRef = useRef<HTMLDivElement>(null); //For comment scrolling :)
    const [comms, setComms] = useState<{ text: string; comment: string; fileURL?: string }[]>([]);
    const [userComm, setUserComm] = useState<string>("");
    const [selectTxt, setSelectTxt] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    //For highlighting which text you would like to comment on.
    const handleTxtSelect = (e: React.MouseEvent <HTMLDivElement, MouseEvent>) => {
        const select = window.getSelection()
        if (select && transCRef.current?.contains(select.anchorNode)){
            const txt = select.toString().trim()

            if (txt)
                setSelectTxt(txt)
        }
    }

    async function uploadFileToBackend(file: File): Promise<string> {
        return new Promise((resolve) => setTimeout(() => resolve("http://example.com/dummyfile"), 1000));
    }

    //For writing a comment and attaching a file to the selected message.
    const handleComm = async () => {
        if (userComm.trim() && selectTxt){
            let fileURL = "";
            
            if (file){
                fileURL = await uploadFileToBackend(file);
                console.log("Oh wow... file!")
            }

            setComms([...comms, { text: selectTxt, comment: userComm, fileURL }])
            setUserComm("")
            setFile(null)
            setSelectTxt("")
        }
    }

    const scrollToComm = (txt : string) => {
        const commID = document.getElementById(txt)
        if (commID){
            commID.scrollIntoView({
                behavior: 'smooth',
                block: 'center',        
            })
        }
    }

    return(
        <BackgroundBeamsWithCollision>
            <div className="container mx-auto justify-self-center p-4">
                <div className="sticky top-0 bg-black z-10 p-4">
                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-center text-white font-sans tracking-tight">
                        Playground
                    </h2>
                    <div className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center text-yellow-300 mb-4">
                        <div>Add comments, once done, click finish.</div>
                        <div>A concise overview of the transcript and associated comments will be generated for your convenience.</div>
                    </div>
                </div>

                <div className="relative mx-auto flex flex-col items-center w-full max-w-3xl mt-4">
                    <div className="mt-6 p-4 bg-neutral-800 rounded-md shadow-md w-full">
                        <div
                            ref={transCRef}
                            className="overflow-y-scroll h-[50vh] p-4 bg-neutral-900 text-white whitespace-pre-wrap"
                            style={{ fontSize: "1rem", lineHeight: "1.75", maxWidth: "100%" }}
                            onMouseUp={handleTxtSelect}>
                            {transC ? (
                                transC.split("\n").map((line, index) => (
                                    <div key={index} id={line}>
                                        {line}
                                    </div>
                                ))
                            ) : (
                                <p>Sorry, no transcript here, please upload a transcript!</p>
                            )}
                        </div>
                    </div>

                    {selectTxt && (
                        <div className="mt-6 p-4 bg-neutral-800 rounded-md shadow-md w-full">
                            <h3 className="text-lg font-bold text-white">Add Comment to: "{selectTxt}"</h3>
                            <textarea
                                value={userComm}
                                onChange={(e) => setUserComm(e.target.value)}
                                placeholder="Add your comment here"
                                className="p-2 w-full rounded-md text-black text-lg"
                                style={{ resize: "vertical", minHeight: "3rem", maxHeight: "10rem" }}/>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                className="mt-2 text-sm text-gray-500"/>
                            <button
                                onClick={handleComm}
                                className="mt-2 p-2 bg-yellow-500 rounded-md text-black text-sm">
                                Add Comment
                            </button>
                        </div>
                    )}

                    <div className="mt-6 mb-10 p-4 bg-neutral-800 rounded-md shadow-md w-full">
                        <h3 className="text-lg font-bold text-white">Comments</h3>
                        <div className="max-h-40 overflow-y-auto mb-5">
                            <ul className="text-white mb-4">
                                {comms.map((comm, idx) => (
                                    <li key={idx} className="mt-2">
                                        <strong onClick={() => scrollToComm(comm.text)} className="cursor-pointer">
                                            "{comm.text}"
                                        </strong>
                                        : {comm.comment}
                                        {comm.fileURL && (
                                            <a href={comm.fileURL} download className="ml-2 text-blue-400">
                                                Download Attachment
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundBeamsWithCollision>
    );
}
