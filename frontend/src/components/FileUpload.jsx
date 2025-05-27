import React, { useState } from "react";

const FileUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      onImageUpload(imageUrl);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>

      <div className="flex flex-col items-center">
        {/* Image Preview */}
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg mb-4" />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg mb-4">
            No Image Selected
          </div>
        )}

        {/* Upload Button */}
        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition">
          Choose File
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
