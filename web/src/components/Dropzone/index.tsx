import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import "./styles.css";
interface Props {
  onFileuploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileuploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const onDrop = useCallback(
    (acceptedFile) => {
      const file = acceptedFile[0];
      const fileUrl = URL.createObjectURL(file);
      setSelectedFileUrl(fileUrl);

      //inserir file no componente Pai
      onFileuploaded(file);
      console.log(acceptedFile);
    },
    [onFileuploaded]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });
  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="point thumbnail" />
      ) : (
        <p>
          <FiUpload />
          Drag 'n' drop some files here, or click to select files
        </p>
      )}
    </div>
  );
};

export default Dropzone;
