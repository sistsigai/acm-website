import React, { useEffect, useState } from 'react';
import { motion as m, AnimatePresence, type Variants } from "framer-motion";
import { FaMedium, FaSearch, } from "react-icons/fa";
import { fetchMediumBlogs } from '../../services/website/blogService';

// --- TYPES ---
interface BlogPost {
    title: string;
    content: string;
    link: string;
    pubDate: string;
    thumbnail?: string;
}

const Blogs: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // --- FETCH DATA ---
    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const data = await fetchMediumBlogs();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            }
        };

        loadBlogs();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- ANIMATION VARIANTS ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 60 } // FIX: Added 'as const'
        }
    };

    return (
        <div className="blog-page">
            <style>{`
        :root {
            --primary-blue: #3b82f6;
            --primary-glow: rgba(59, 130, 246, 0.6);
            --glass-bg: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.1);
        }

        .blog-page {
            width: 100%;
            padding: 120px 20px 60px;
            display: flex; flex-direction: column; align-items: center;
            font-family: 'Poppins', sans-serif; min-height: 100vh;
        }

        /* --- HEADER & SEARCH --- */
        .page-header {
            text-align: center; margin-bottom: 50px; width: 100%; max-width: 800px;
        }

        .text-gradient {
            background: linear-gradient(135deg, #fff 0%, var(--primary-blue) 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; letter-spacing: -2px;
        }

        .search-container {
            margin-top: 30px; position: relative; width: 100%; 
            max-width: 500px; margin-left: auto; margin-right: auto;
        }

        .search-icon {
            position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
            color: var(--primary-blue); font-size: 1.1rem;
        }

        .search-input {
            width: 100%; padding: 15px 20px 15px 50px;
            background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border);
            border-radius: 50px; color: #fff; font-size: 1rem;
            backdrop-filter: blur(5px); transition: all 0.3s ease;
        }

        .search-input:focus {
            outline: none; border-color: var(--primary-blue);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            background: rgba(255, 255, 255, 0.08);
        }

        /* --- FOLLOW BUTTON --- */
        .follow-container { margin-bottom: 60px; }
        
        .follow-btn {
            display: flex; align-items: center; gap: 10px;
            background: rgba(255, 255, 255, 0.05); border: 1px solid var(--primary-blue);
            color: #fff; padding: 12px 30px; border-radius: 30px; font-weight: 600;
            cursor: pointer; transition: 0.3s; text-decoration: none;
            backdrop-filter: blur(5px);
        }

        .follow-btn:hover {
            background: var(--primary-blue);
            box-shadow: 0 0 25px var(--primary-glow);
            transform: translateY(-2px);
        }

        /* --- BLOG GRID --- */
        .blog-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 30px; width: 100%; max-width: 1200px;
        }

        .blog-card {
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 24px; padding: 35px; position: relative; overflow: hidden;
            transition: all 0.4s ease; display: flex; flex-direction: column;
            backdrop-filter: blur(10px); height: 100%;
        }

        .blog-card:hover {
            transform: translateY(-8px); border-color: var(--primary-blue);
            box-shadow: 0 20px 50px rgba(59, 130, 246, 0.15);
            background: rgba(255, 255, 255, 0.05);
        }

        .post-date {
            font-size: 0.8rem; color: var(--primary-blue); margin-bottom: 15px;
            text-transform: uppercase; letter-spacing: 1px; font-weight: 700;
            display: flex; align-items: center; gap: 8px;
        }

        .post-title {
            font-size: 1.5rem; color: #fff; font-weight: 700; margin-bottom: 15px;
            line-height: 1.3;
        }

        .post-excerpt {
            font-size: 0.95rem; color: #cbd5e1; line-height: 1.7; 
            margin-bottom: 30px; flex-grow: 1; font-weight: 300;
        }

        .read-more-btn {
            display: inline-flex; align-items: center; gap: 10px;
            color: #fff; text-decoration: none; font-weight: 600;
            transition: 0.3s; width: fit-content; padding-top: 15px;
            border-top: 1px solid rgba(255,255,255,0.1); width: 100%;
        }

        .read-more-btn:hover { color: var(--primary-blue); gap: 15px; }

        /* --- HIGHLIGHT SEARCH --- */
        .highlight-text {
            background: rgba(59, 130, 246, 0.3); color: #fff;
            padding: 0 4px; border-radius: 4px;
        }

        /* --- BACK TO TOP --- */
        .back-to-top {
            position: fixed; bottom: 30px; right: 30px;
            width: 50px; height: 50px; border-radius: 50%;
            background: rgba(59, 130, 246, 0.2); color: #fff; 
            border: 1px solid var(--primary-blue);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
            transition: 0.3s; z-index: 100; backdrop-filter: blur(5px);
        }

        .back-to-top:hover { 
            transform: translateY(-5px); 
            background: var(--primary-blue);
            box-shadow: 0 0 30px var(--primary-glow);
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 768px) {
            .blog-grid { grid-template-columns: 1fr; }
            .page-header { padding: 0 20px; }
            .text-gradient { font-size: 2.5rem; }
        }

        .blog-image {
  margin: 20px 0 10px;
  border-radius: 14px;
  overflow: hidden;
}

.blog-image img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 14px;
  transition: transform 0.4s ease;
}

.blog-card:hover .blog-image img {
  transform: scale(1.05);
}
      `}</style>

            {/* --- HEADER --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    SIGAI CHRONICLES
                </m.h1>
                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '10px' }}
                >
                    Insights, tutorials, and updates from the student chapter.
                </m.p>

                {/* --- SEARCH --- */}
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- FOLLOW BUTTON --- */}
            <m.div
                className="follow-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <a href='https://medium.com/@sist.sigai' target='_blank' rel='noopener noreferrer' className="follow-btn">
                    <FaMedium size={20} /> Follow on Medium
                </a>
            </m.div>

            {/* --- BLOG POSTS --- */}
            <m.div
                className="blog-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                <AnimatePresence>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => (
                            <m.div
                                key={`${post.link}-${index}`}
                                className="blog-card"
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="post-date">
                                    {post.pubDate.split(" ")[0]}
                                </div>

                                <h3 className="post-title">{post.title}</h3>

                                <p className="post-excerpt">{post.content}</p>

                                {post.thumbnail && (
                                    <div className="blog-image">
                                        <img src={post.thumbnail} alt={post.title} />
                                    </div>
                                )}

                                <a
                                    href={post.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="read-more-btn"
                                >
                                    Read Full Article
                                </a>
                            </m.div>
                        ))
                    ) : (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                color: '#94a3b8',
                                textAlign: 'center',
                                gridColumn: '1/-1',
                                marginTop: '40px'
                            }}
                        >
                            No transmission found matching query.
                        </m.div>
                    )}
                </AnimatePresence>
            </m.div>


        </div>
    );
};

export default Blogs;