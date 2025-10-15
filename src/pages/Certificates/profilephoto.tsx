import React, { useState, useEffect } from "react";
import { FieldValues, UseFormRegister, FieldErrors } from "react-hook-form";
import { IMG_URL } from "../../utils/constants";

interface PassportUploadProps {
  name: string;
  register: any;
  errors: FieldErrors<FieldValues>;
  initialImageUrl?: string; // optional, since it might not be provided
}

const PassportUpload: React.FC<PassportUploadProps> = ({
  name,
  register,
  errors,
  initialImageUrl,
}) => {
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    initialImageUrl ?? null
  );
  const handleImageError = () => {
    // Clear the preview image if it cannot be loaded
    setPreviewImage(null);
  };

  useEffect(() => {
    setPreviewImage(initialImageUrl ?? null);
  }, [initialImageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Validate file type here if needed

    // Display preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      register(name, { value: file, required: "Passport photo is required" }); // Register file with React Hook Form
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <div className="col-span-12 sm:col-span-4">
      <input
        onChange={handleImageChange}
        type="file"
        name={name}
        accept=".jpg, .jpeg, .png"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      />

      {previewImage && IMG_URL != previewImage && (
        <div className="mt-4">
          <img
            src={previewImage as string}
            alt="Preview"
            width={120}
            className=" rounded-md shadow-md"
            onError={handleImageError} // Handle image loading error
          />
        </div>
      )}
      {/* Display error messages */}
    </div>
  );
};

export default PassportUpload;
