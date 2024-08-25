import PDFParser from "pdf2json";
import fs from "fs";
import path from "path";
import multiparty from "multiparty";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
    try {
        if (req.method === "POST") {
            const form = new multiparty.Form();

            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error("Form parsing error:", err);
                    return res.status(500).json({ error: "File upload error" });
                }

                const file = files.file[0];
                const filePath = file.path;
                const pdfParser = new PDFParser();

                pdfParser.on("pdfParser_dataReady", (pdfData) => {
                    let txt = "";
                    pdfData?.Pages?.forEach((page) => {
                        page.Texts?.forEach((text) => {
                            text?.R?.forEach((t) => {
                                txt += decodeURIComponent(t.T) + " ";
                            });
                            txt += "\n";
                        });
                    });
                    res.status(200).json({ text: txt });
                });

                fs.readFile(filePath, (err, pdfBuffer) => {
                    if (err) {
                        console.error("File reading error:", err);
                        return res.status(500).json({ error: "Error reading file" });
                    }
                    pdfParser.parseBuffer(pdfBuffer);
                });
            });
        } else {
            res.setHeader("Allow", ["POST"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
