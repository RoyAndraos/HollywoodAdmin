import { useEffect, useState } from "react";
import { AdvancedImage } from "@cloudinary/react";

const SeeImages = () => {
  const [imageIds, setImageIds] = useState();

  useEffect(() => {
    fetch("/getImages")
      .then((res) => res.json())
      .then((data) => setImageIds(data))
      .catch((err) => console.log(err));
  }, []);

  if (!imageIds) return <p>Loading...</p>;
  else {
    console.log(imageIds);

    return (
      <div>
        <AdvancedImage
          key={1}
          cloudName="dxvktjehr"
          publicId={imageIds}
          width="300" // Set your desired width for the image
          crop="scale"
          alt={`Image`}
        />
        {
          //imageIds.map((imageId, index) => (
          //  <AdvancedImage
          //    key={index}
          //    cloudName="dxvktjehr"
          //    publicId={"dccae0ce0de8c8c8555134577e9489ef"}
          //    width="300" // Set your desired width for the image
          //    crop="scale"
          //    alt={`Image ${index}`}
          //  />
          //))
        }
      </div>
    );
  }
};

export default SeeImages;
