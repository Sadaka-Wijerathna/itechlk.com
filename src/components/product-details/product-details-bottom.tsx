"use client";

import { IProduct } from '@/types/product-d-t';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// prop type
type IProps = {
  product: IProduct;
}

const ProductDetailsBottom = ({ product }: IProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = (e: React.MouseEvent, starIndex: number) => {
    e.preventDefault();
    setRating(starIndex);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setRating(0);
      setComment('');
      router.refresh(); // Refresh to see the new review
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete review");
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };


  return (
    <div className="shop__bottom">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="product__details-tab">
              <div className="product__details-tab-nav text-center mb-45">
                <nav>
                  <div className="nav nav-tabs justify-content-start justify-content-sm-center" id="pro-details" role="tablist">
                    <a className="nav-item nav-link active" id="des-tab" data-bs-toggle="tab" href="#des" role="tab" aria-controls="des" aria-selected="true" tabIndex={-1}>Description</a>
                    <a className="nav-item nav-link" id="review-tab" data-bs-toggle="tab" href="#review" role="tab" aria-controls="review" aria-selected="false" tabIndex={-1}>Reviews ({product.reviews.length})</a>
                  </div>
                </nav>
              </div>
              <div className="tab-content" id="pro-detailsContent">
                <div className="tab-pane fade show active" id="des" role="tabpanel" aria-labelledby='des-tab'>
                  <div className="product__details-des">
                    <p>{product.details.details_text}</p>

                    {product.details.details_list.length > 0 && (
                      <div className="product__details-des-list mb-20">
                        <ul>
                          {product.details.details_list.map((item, i) => (
                            <li key={i}><span>{item}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="tab-pane fade" id="review" role="tabpanel" aria-labelledby='review-tab'>
                  <div className="product__details-review">
                    <div className="postbox__comments">
                      <div className="postbox__comment-title mb-30">
                        <h3>Reviews ({product.reviews.length})</h3>
                      </div>
                      <div className="latest-comments mb-30">
                        <ul>
                          {product?.reviews?.map((review, index) => (
                            <li key={index}>
                              <div className="comments-box">
                                <div className="comments-avatar">
                                  <Image src={review.img} alt="review-img" width={78} height={79} />
                                </div>
                                <div className="comments-text">
                                  <div className="avatar-name">
                                    <h5>{review.name}</h5>
                                    <span> - {review.time} </span>
                                    <div className="d-inline-flex ml-15">
                                      {((session?.user as any)?.id === review.userId || (session?.user as any)?.role === 'admin') && (
                                        <button 
                                          onClick={() => handleDeleteReview(review.id)}
                                          className="text-danger"
                                          style={{ fontSize: '12px', background: 'none', border: 'none', padding: 0 }}
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="user-rating">
                                    <ul>
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <li key={star}>
                                          <i className={star <= review.rating ? "fas fa-star" : "fal fa-star"} 
                                             style={{ color: star <= review.rating ? '#ffb041' : '#ccc' }}></i>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <p>{review.review_desc}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="post-comments-form mb-100">
                      <div className="post-comments-title mb-30">
                        <h3>Your Review</h3>
                      </div>
                      
                      {!session ? (
                        <div className="login-prompt mb-30">
                          <p>
                            Please <Link href="/login" className="text-primary" style={{ textDecoration: 'underline' }}>login</Link> to leave a review.
                          </p>
                        </div>
                      ) : (
                        <form id="contacts-form" className="conatct-post-form" onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-xl-12 mb-20">
                              <div className="post-rating d-flex align-items-center">
                                <span className="mr-15">Your Rating :</span>
                                <ul>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <li key={star}>
                                      <a 
                                        href="#" 
                                        onClick={(e) => handleRating(e, star)}
                                        style={{ color: star <= rating ? '#ffb041' : '#ccc' }}
                                      >
                                        <i className={star <= rating ? "fas fa-star" : "fal fa-star"}></i>
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="col-xl-12">
                              <div className="contact-icon p-relative contacts-message">
                                <textarea 
                                  name="comments" 
                                  id="comments" 
                                  cols={30} 
                                  rows={10} 
                                  placeholder="Your Comment..."
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                              </div>
                            </div>
                            <div className="col-xl-12 mt-20">
                              <button 
                                className="os-btn os-btn-black" 
                                type="submit" 
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Posting..." : "Post comment"}
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsBottom;