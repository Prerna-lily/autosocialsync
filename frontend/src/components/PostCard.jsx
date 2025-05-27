import React from 'react';

const PostCard = ({ post }) => {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="font-bold text-lg">{post.title || post.what_to_post}</h3>
      <p><strong>Type:</strong> {post.type || post.type_of_post}</p>
      <p><strong>Schedule:</strong> {post.schedule || post.posting_schedule}</p>
      <p><strong>Description:</strong> {post.description || post.detailed_description}</p>
      <p><strong>CTA:</strong> {post.cta || post.call_to_action}</p>
      {post.slides && (
        <div className="mt-2">
          <strong>Slides:</strong>
          <ul className="list-disc pl-5">
            {post.slides.map((slide, i) => (
              <li key={i}>{slide}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostCard;
