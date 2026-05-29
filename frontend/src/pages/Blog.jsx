import React from 'react';
import { Link } from 'react-router-dom';
import { RiCalendarEventLine, RiTimeLine } from 'react-icons/ri';
import Footer from './Footer';
import Header from '../components/Header';
import bg from '../Assets/bm.jpg'

export const Blog = () => {
    
  const blogPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      authorName: 'admin',
      title: 'How to maintain your rental car for optimal performance',
      date: 'January 25, 2026',
      readTime: '8 min read',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      authorName: 'admin',
      title: 'Traveling with kids making family road trips enjoyable',
      date: 'January 24, 2026',
      readTime: '5 min read',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      authorName: 'admin',
      title: 'Top 10 essential road trip tips for your next adventure',
      date: 'January 23, 2026',
      readTime: '7 min read',
    }
  ];

  return (
    <div className="bg-x-bg min-h-screen text-x-text">
        <Header />
        
        {/* Hero Section */}
        <div 
            className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] flex items-center relative bg-cover bg-center pt-16 sm:pt-20 border-b border-x-border"
            style={{ 
                backgroundImage: `linear-gradient(to right, rgba(10, 11, 15, 0.98) 0%, rgba(10, 11, 15, 0.85) 50%, rgba(10, 11, 15, 0.2) 100%), url(${bg})`,
                backgroundColor: '#0a0b0f' 
            }}
        >
            <div className='container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 z-10 h-full'>
                <div className="flex flex-col justify-center h-full max-w-[90%] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
                    <h1 className="text-x-text font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 leading-tight drop-shadow-lg" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        Blog Grid
                    </h1>
                    <div className="flex items-center text-xs sm:text-sm md:text-base font-medium">
                        <span className="text-x-primary hover:text-[#b34a08] cursor-pointer transition-colors">Home</span>
                        <span className="mx-2 sm:mx-3 text-x-text-muted">/</span>
                        <span className="text-x-text-muted">Blog Grid</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Blog Content Section */}
        <div className="py-12 sm:py-16 md:py-20 lg:py-24 bg-x-bg relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-x-primary-glow rounded-full blur-[120px] opacity-30 pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto mb-10 sm:mb-12 md:mb-16">
                    <h4 className="text-x-primary font-bold text-xs sm:text-sm md:text-base mb-3 sm:mb-4 tracking-wider uppercase drop-shadow-sm">
                        RentQ Blog & Travel Tips
                    </h4>
                    <h2 className="text-x-text font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug sm:leading-tight" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        Discover expert travel advice, car rental tips, destination guides, and the latest news from RentQ.
                    </h2>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {blogPosts.map((post) => (
                        <Link to={`/blogdetails/${post.id}`} key={post.id} className="flex text-decoration-none flex-col group bg-x-surface rounded-2xl overflow-hidden border border-x-border hover:border-x-border-active transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                            {/* Card Image */}
                            <div className="w-full h-[200px] sm:h-[220px] md:h-[250px] lg:h-[260px] overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-x-surface to-transparent opacity-80 z-10 top-[60%]"></div>
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            
                            <div className="p-6 flex flex-col flex-grow relative z-20">
                                {/* Author Info */}
                                <div className="flex items-center mb-4 mt-[-40px]">
                                    <img src={post.authorAvatar} alt={post.authorName} className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-x-surface shadow-md" />
                                    <span className="text-x-text-muted text-sm sm:text-[15px] pt-4">
                                        Written by <span className="font-bold text-x-text">{post.authorName}</span>
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-x-text font-bold text-lg sm:text-xl lg:text-2xl mb-6 leading-snug group-hover:text-x-primary transition-colors" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                    {post.title}
                                </h3>

                                {/* Meta data */}
                                <div className="flex items-center gap-4 sm:gap-6 mt-auto text-sm sm:text-[15px] text-x-text-muted font-medium border-t border-x-border pt-5">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <RiCalendarEventLine className="text-x-primary text-lg sm:text-xl" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <RiTimeLine className="text-x-primary text-lg sm:text-xl" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

        {/* <Footer /> */}
    </div>
  )
}
