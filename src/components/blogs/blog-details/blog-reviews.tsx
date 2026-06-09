import Image from "next/image";

interface BlogCommentType {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
}

interface BlogReviewsProps {
  comments?: BlogCommentType[];
}

const BlogReviews = ({ comments = [] }: BlogReviewsProps) => {
  if (comments.length === 0) {
    return <p style={{ color: "#848b8a", fontSize: "14px" }}>No comments yet. Be the first to share your thoughts!</p>;
  }

  return (
    <ul>
      {comments.map((comment, index) => (
        <li key={comment.id || index}>
          <div className="comments-box">
            <div className="comments-avatar">
              <Image 
                src="/assets/img/icon/avatar.jpg" 
                alt="avatar-img" 
                width={78} 
                height={79} 
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
            <div className="comments-text">
              <div className="avatar-name">
                <h5>{comment.name}</h5>
                <span> - {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} </span>
              </div>
              <p>{comment.comment}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BlogReviews;
