
import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onImageChange(null);
      setPreview(null);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="w-full text-center p-4 border-2 border-dashed border-[#7B61FF]/30 rounded-lg">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      {preview ? (
        <div className="flex flex-col items-center gap-3">
            <img src={preview} alt="Preview" className="max-h-40 rounded-md shadow-sm"/>
            <button onClick={handleRemoveImage} className="text-sm text-red-500 hover:underline">Remove Image</button>
        </div>
      ) : (
        <button onClick={() => fileInputRef.current?.click()} className="text-[#7B61FF] font-semibold">
          + Add an Image (Optional)
        </button>
      )}
    </div>
  );
};
