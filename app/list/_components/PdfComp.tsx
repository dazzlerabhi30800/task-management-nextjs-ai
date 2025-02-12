import React from "react";
import { Document, Page } from "react-pdf";
import { docs } from "./FilePreview";

type props = {
  fileLink: string;
  setDocInfo: React.Dispatch<React.SetStateAction<docs>>;
};
const PdfComp = ({ fileLink, setDocInfo }: props) => {
  console.log(fileLink);
  try {
    return (
      <Document
        onLoadSuccess={(pdf) =>
          setDocInfo((prev) => ({ ...prev, pageLimit: pdf.numPages }))
        }
        className="overflow-hidden document-viewer"
        file={fileLink}
      >
        <Page pageIndex={0} />
      </Document>
    );
  } catch (err) {
    console.log(err);
  }
  return <div>Error: There is some error</div>;
  // return <div>PdfComp</div>;
};

export default PdfComp;
