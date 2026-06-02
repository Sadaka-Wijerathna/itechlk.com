import Image from "next/image";

// reviews
const reviews = [
  {
    img: "/assets/img/blog/comments/avater-1.png",
    name: "Siarhei Dzenisenka",
    time: "3 Months Ago",
    rating: 4,
  },
  {
    img: "/assets/img/blog/comments/avater-2.png",
    name: "Julias Roy",
    time: "6 Months Ago",
    rating: 4,
    children: true,
  },
  {
    img: "/assets/img/blog/comments/avater-3.png",
    name: "Arista Williamson",
    time: "6 Months Ago",
    rating: 4,
  },
];

const BlogReviews = () => {
  return (
    <ul>
      {reviews.map((review, index) => (
        <li key={index} className={review.children ? "children" : ""}>
          <div className="comments-box">
            <div className="comments-avatar">
              <Image src={review.img} alt="review-img" width={78} height={79} />
            </div>
            <div className="comments-text">
              <div className="avatar-name">
                <h5>{review.name}</h5>
                <span> - {review.time} </span>
                <a className="reply" href="#">
                  Leave Reply
                </a>
              </div>
              <div className="user-rating">
                <ul>
                  <li>
                    <a href="#">
                      <i className="fas fa-star"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fas fa-star"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fas fa-star"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fas fa-star"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-star"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <p>
                Many desktop publishing packages and web page editors now use
                Lorem Ipsum as their default model text, and a search for{" "}
                <span>“lorem ipsum”</span> will uncover many web sites still in
                their infancy. Various versions have evolved over the years,
                sometimes by accident, sometimes on purpose.
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BlogReviews;
