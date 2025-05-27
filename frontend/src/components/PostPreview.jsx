import React from "react";

const PostPreview = ({ uploadedImage, caption }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Post Preview</h2>
      <div className="border rounded-xl overflow-hidden shadow-sm">
        {/* Display uploaded image or a placeholder */}
        {uploadedImage ? (
          <img src={uploadedImage} alt="Generated Preview" className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-500">
            No Image Available
          </div>
        )}

        {/* Caption preview */}
        <div className="p-4">
          <p className="text-gray-700">{caption || "Your caption will appear here..."}</p>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
