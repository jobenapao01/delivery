"use client";

import { UploadButton, UploadDropzone } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type ImageUploadProps = {
  onUploadComplete: (url: string) => void;
  initialUrl: string;
};

export default function ImageUpload({
  onUploadComplete,
  initialUrl,
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialUrl);

  const handleUploadComplete = (files: { url: string }[]) => {
    if (files.length > 0) {
      const url = files[0].url;
      setImageUrl(url);
      onUploadComplete(url);
    }
  };

  return (
    <main className="w-full space-y-2">
      <UploadButton
        endpoint="imageUploader"
        // onClientUploadComplete={(res) => {
        //   // Do something with the response
        //   console.log("Files: ", res);
        //   const url = res[0].url;
        //   setImageUrl(url);
        //   onUploadComplete(url);
        // }}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      {imageUrl?.length ? (
        <div>
          <Image src={imageUrl} alt="product" width={100} height={50} />
        </div>
      ) : null}
    </main>
  );
}
