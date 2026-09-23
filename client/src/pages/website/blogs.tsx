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