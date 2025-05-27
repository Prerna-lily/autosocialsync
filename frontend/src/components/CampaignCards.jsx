import React from "react";

const CampaignCards = ({ campaignData }) => {
  if (!campaignData || !campaignData.raw) return null;

  // Extract raw content and split into posts
  const postsRaw = campaignData.raw.split("### Post ");
  postsRaw.shift(); // remove the title part

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
      {postsRaw.map((post, index) => {
        const lines = post.trim().split("\n").filter(Boolean);

        const postNumber = index + 1;
        const whatToPost = lines[1]?.split(":")[1]?.trim();
        const typeOfPost = lines[2]?.split(":")[1]?.trim();
        const postingSchedule = lines[3]?.split(":")[1]?.trim();
        const description = lines[4]?.split(":")[1]?.trim() + " " + lines[5]?.trim();
        const callToAction = lines[6]?.split(":")[1]?.trim();

        return (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Post {postNumber}: {whatToPost}</h2>
            <p className="text-sm text-gray-500 mb-1"><span className="font-semibold">Type:</span> {typeOfPost}</p>
            <p className="text-sm text-gray-500 mb-2"><span className="font-semibold">Schedule:</span> {postingSchedule}</p>
            <p className="text-gray-700 mb-2">{description}</p>
            <p className="text-purple-600 font-medium italic">👉 {callToAction}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CampaignCards;
