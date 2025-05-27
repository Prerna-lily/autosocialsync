import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Library = () => {
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    // Fetch drafts from backend
    const fetchDrafts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-drafts/');
        setDrafts(response.data);
      } catch (error) {
        console.error('Error fetching drafts:', error);
      }
    };

    fetchDrafts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Saved Drafts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {drafts.length > 0 ? (
          drafts.map((draft) => (
            <div
              key={draft._id}
              className="bg-white shadow-md rounded-lg overflow-hidden p-4"
            >
              {draft.image_url && (
                <img
                  src={draft.image_url}
                  alt="Draft"
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="text-lg font-bold">{draft.caption}</h3>
              <p className="text-gray-600 text-sm mt-1">Platform: {draft.platform}</p>
              {draft.prompt && (
                <p className="text-gray-500 text-xs mt-2">Prompt: {draft.prompt}</p>
              )}
            </div>
          ))
        ) : (
          <p>No drafts available.</p>
        )}
      </div>
    </div>
  );
};

export default Library;
