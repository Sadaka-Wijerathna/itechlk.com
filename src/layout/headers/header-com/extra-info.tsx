import Link from "next/link";

const extra_info = [
  {
    class: "my-account",
    title: "My Account",
    listItems: [
      { link: "/login", title: "Login" },
      { link: "/wishlist", title: "Wishlist" },
      { link: "/cart", title: "Cart" },
      { link: "/checkout", title: "Checkout" },
      { link: "/register", title: "Create Account" },
    ],
  },
  {
    class: "currency",
    title: "Currency",
    listItems: [
      { link: "/", title: "LKR - Sri Lankan Rupee" },
      { link: "/", title: "USD - US Dollar" },
      { link: "/", title: "EUR - Euro" },
    ],
  },
];

const ExtraInfo = () => {
  return (
    <ul className="extra-info">
      {extra_info.map((item, index) => (
        <li key={index}>
          <div className={`${item.class}`}>
            <div className="extra-title">
              <p className="extra-info__label" role="heading" aria-level={2}>{item.title}</p>
            </div>
            <ul>
              {item.listItems.map((list, index) => (
                <li key={index}>
                  <Link href={`${list.link}`}>
                      {`${list.title}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ExtraInfo;
