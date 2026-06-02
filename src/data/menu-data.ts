import { IMenuType, IMobileMenu } from "../types/menu-d-t";

const menuData:IMenuType[] = [
  {
    link: '/',
    title: 'Home',
    hasDropdown: false,
    megamenu: false
  },
  {
    link: '/shop',
    title: 'Shop',
    hasDropdown: false,
    megamenu: false
  },
  {
    link: '/blog',
    title: 'Blog',
    hasDropdown: true,
    megamenu: false,
    dropdownItems: [
      { link: '/blog', title: 'Blog' },
      { link: '/blog-left-sidebar', title: 'Blog Left Sidebar' },
      { link: '/blog-no-sidebar', title: 'Blog No Sidebar' },
      { link: '/blog-2-col', title: 'Blog 2 Column' },
      { link: '/blog-3-col', title: 'Blog 3 Column' },
      { link: '/blog-details', title: 'Blog Details' },
    ]
  },
  {
    link: '/shop',
    title: 'Categories',
    hasDropdown: true,
    megamenu: false,
    dropdownItems: [
      { link: '/shop?category=AI%20Tools', title: 'AI Tools' },
      { link: '/shop?category=Creative%20%26%20Editing', title: 'Creative & Editing' },
      { link: '/shop?category=Work%20%26%20OS', title: 'Work & OS' },
      { link: '/shop?category=Streaming', title: 'Streaming' },
      { link: '/shop?category=VPNs', title: 'VPNs' },
      { link: '/shop?category=Adults', title: 'Adults' },
    ]
  },
  {
    link: '/contact',
    title: 'Contact',
  },
]

export default menuData;

// mobile menus
export const mobile_menus:IMobileMenu[] = [
  {
    title: "Home",
    link: '/',
  },
  {
    title: "Shop",
    link: '/shop',
  },
  {
    title: "Categories",
    dropdownMenu: [
      { link: '/shop?category=AI%20Tools', title: 'AI Tools' },
      { link: '/shop?category=Creative%20%26%20Editing', title: 'Creative & Editing' },
      { link: '/shop?category=Work%20%26%20OS', title: 'Work & OS' },
      { link: '/shop?category=Streaming', title: 'Streaming' },
      { link: '/shop?category=VPNs', title: 'VPNs' },
      { link: '/shop?category=Adults', title: 'Adults' },
    ],
  },
  {
    title: "Blog",
    dropdownMenu: [
      { link: '/blog', title: 'Blog' },
      { link: '/blog-left-sidebar', title: 'Blog Left Sidebar' },
      { link: '/blog-no-sidebar', title: 'Blog No Sidebar' },
      { link: '/blog-2-col', title: 'Blog 2 Column' },
      { link: '/blog-3-col', title: 'Blog 3 Column' },
      { link: '/blog-details', title: 'Blog Details' },
    ],
  },
  {
    title: "Contact",
    link: '/contact',
  },
];
