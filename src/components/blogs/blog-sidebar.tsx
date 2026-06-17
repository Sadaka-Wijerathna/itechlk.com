"use client";

import Link from "next/link";
import IBlogType from "@/types/blog-d-t";

type SidebarProps = {
  allBlogs?: IBlogType[];
};

const BlogSidebar = ({ allBlogs = [] }: SidebarProps) => {
  // ── Derive all sidebar data synchronously from server-passed props ──────
  const recentBlogs = allBlogs.slice(0, 4);

  const catMap: Record<string, number> = {};
  allBlogs.forEach((b) => {
    const cat = b.category || "Uncategorized";
    catMap[cat] = (catMap[cat] || 0) + 1;
  });
  const categories = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const archiveMap: Record<string, number> = {};
  allBlogs.forEach((b) => {
    const d = new Date((b as any).createdAt || (b as any).date || new Date().toISOString());
    const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    archiveMap[label] = (archiveMap[label] || 0) + 1;
  });
  const archives = Object.entries(archiveMap)
    .slice(0, 6)
    .map(([label, count]) => ({ label, count }));

  return (
    <div className="sidebar__wrapper">

      {/* ── Search ── */}
      <div className="sidebar__widget mb-55">
        <div className="widget__search p-relative">
          <form
            action="/blog"
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement)?.value;
              if (q) window.location.href = `/blog?q=${encodeURIComponent(q)}`;
            }}
          >
            <input type="text" name="q" placeholder="Search articles..." />
            <button type="submit"><i className="far fa-search" /></button>
          </form>
        </div>
      </div>

      {/* ── Blog Categories ── */}
      <div className="sidebar__widget mb-55">
        <div className="sidebar__widget-title mb-25">
          <h3>Blog Categories</h3>
        </div>
        <div className="sidebar__widget-content">
          <div className="sidebar__links">
            {categories.length === 0 ? (
              <p className="text-muted" style={{ fontSize: "13px" }}>No categories yet.</p>
            ) : (
              <ul>
                {categories.map(({ name, count }) => (
                  <li key={name}>
                    <Link href={`/blog?category=${encodeURIComponent(name)}`}>
                      {name}
                      <span style={{ float: "right", background: "#f5f5f5", borderRadius: "10px", padding: "0 7px", fontSize: "12px", color: "#666" }}>
                        {count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Latest Posts ── */}
      <div className="sidebar__widget mb-55">
        <div className="sidebar__widget-title mb-25">
          <h3>Latest Posts</h3>
        </div>
        <div className="sidebar__widget-content">
          <div className="rc__post-wrapper">
            {recentBlogs.length === 0 ? (
              <p className="text-muted" style={{ fontSize: "13px" }}>No posts yet.</p>
            ) : (
              <ul>
                {recentBlogs.map((b) => (
                  <li key={b.id} className="d-flex" style={{ marginBottom: "16px" }}>
                    <div className="rc__post-thumb mr-20">
                      <Link href={`/blog/${b.slug}`}>
                        <img
                          src={b.image || (b as any).img}
                          alt={b.title}
                          width={70}
                          height={70}
                          style={{ objectFit: "cover", borderRadius: "4px" }}
                          onError={(e: any) => { e.target.src = "/assets/img/logo/logo.png"; }}
                        />
                      </Link>
                    </div>
                    <div className="rc__post-content">
                      <h6>
                        <Link href={`/blog/${b.slug}`}>
                          {b.title.length > 40 ? b.title.slice(0, 40) + "…" : b.title}
                        </Link>
                      </h6>
                      <div className="rc__meta">
                        <span>
                          {new Date((b as any).createdAt || (b as any).date || new Date().toISOString()).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Archives ── */}
      <div className="sidebar__widget mb-55">
        <div className="sidebar__widget-title mb-25">
          <h3>Archives</h3>
        </div>
        <div className="sidebar__widget-content">
          <div className="sidebar__links">
            {archives.length === 0 ? (
              <p className="text-muted" style={{ fontSize: "13px" }}>No posts yet.</p>
            ) : (
              <ul>
                {archives.map(({ label, count }) => (
                  <li key={label}>
                    <a href={`/blog?archive=${encodeURIComponent(label)}`}>
                      {label}
                      <span style={{ float: "right", background: "#f5f5f5", borderRadius: "10px", padding: "0 7px", fontSize: "12px", color: "#666" }}>
                        {count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default BlogSidebar;