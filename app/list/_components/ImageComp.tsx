import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ImageComp = ({ fileLink, path }: { fileLink: string; path: string }) => {
  const [loading, setLoading] = useState(true);
  return (
    <Link
      href={fileLink}
      target="_blank"
      className={`flex h-[150px] w-inherit md:h-[130px] bg-red-100 rounded-md ${
        loading ? "animate-pulse" : ""
      }`}
    >
      <Image
        src={fileLink}
        alt={path}
        onLoad={() => setLoading(false)}
        priority
        width={200}
        height={100}
        style={{ width: "100%", height: "100%" }}
        className="h-full w-full md:w-[300px] object-cover rounded-md  group-hover:grayscale-[0.8] transition-all"
      />
    </Link>
  );
};

export default ImageComp;
