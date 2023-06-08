import axios from "axios";
import { useState, useEffect } from "react";
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import picture from '../../img/sign3.png'
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const AddImage2 = () => {

    const [pdfInfo, setPdfInfo] = useState([]);

    useEffect(() => {
        //modifyPdf();
    }, []);

    const modifyPdf = async () => {
        const existingPdfBytes = await fetch(
        "http://localhost:3500/letters/download/647dc88320ff256571fd4af5"
        ).then((res) => res.arrayBuffer()
        );

        const pngImageBytes = await fetch(picture).then((res) => res.arrayBuffer());
        //console.log(pngImageBytes)

        // const existingPdfBytes = axios.get(`http://localhost:3500/letters/download/6476edbc4cdf142b23ea61fa`, { responseType: 'arraybuffer' })
        // .then((res) => {
        //    return Buffer.from(res.data).toString('base64');
        // })

        //console.log(existingPdfBytes)
        
        //load pdf file
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pngImage = await pdfDoc.embedPng(pngImageBytes)
        const pngDims = pngImage.scaleToFit(100, 300)

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        firstPage.drawImage(pngImage, {
            // x: firstPage.getWidth() / 5.5 - pngDims.width / 2,
            x: firstPage.getWidth() / 5.5 - pngDims.width / 2,
            y: firstPage.getHeight() / 6 - pngDims.height / 2,
            width: pngDims.width,
            height: pngDims.height,
          })

        const pdfBytes = await pdfDoc.save();
        const bytes  = new Uint8Array( pdfBytes ); 
        const blob   = new Blob( [ bytes ], { type: "application/pdf" } );
        const docUrl = URL.createObjectURL( blob );
        setPdfInfo( docUrl );
    };
  

    return (
        <>
            <h3>this is add image</h3>
            {/* <button onClick={loadPdf()}>Sign</button> */}
            {/* <iframe src={pdfInfo} id="pdf" style={{width: '100%', height: '100%'}}></iframe> */}

            <button onClick={modifyPdf}>Toggle me</button>

            <div
                style={{
                border: "1px solid rgba(0, 0, 0, 0.3)",
                height: "500px",
                }}
            >
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={pdfInfo} />
                </Worker>
            </div>
        </>
        
    )
}

export default AddImage2;