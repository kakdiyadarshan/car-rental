import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { RiCalendarEventLine, RiTimeLine, RiArrowLeftLine, RiTwitterXLine, RiFacebookCircleLine, RiLinkedinBoxLine } from 'react-icons/ri';
import Header from '../components/Header';
import Footer from './Footer';

export const BlogDetails = () => {
  const { id } = useParams();

  // Mocked full blog post data for design demonstration
  const post = {
    id: id || 1,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1920&q=80',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorName: 'Admin',
    authorRole: 'Senior Automotive Editor',
    title: 'How to maintain your rental car for optimal performance during long road trips',
    date: 'January 25, 2026',
    readTime: '8 min read',
    tags: ['Maintenance', 'Road Trip', 'Tips'],
    content: `
      <p class="text-lg sm:text-xl md:text-2xl text-x-text leading-relaxed font-light mb-6 sm:mb-8">Embarking on a long road trip is an exhilarating experience, offering the promise of new landscapes and unforgettable memories. However, the journey's success heavily relies on the reliability of your vehicle. Whether you're driving your own car or a luxury rental, maintaining optimal performance is crucial.</p>
      
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bebas text-white tracking-wide mt-10 sm:mt-12 mb-4 sm:mb-6 uppercase">1. Pre-Trip Inspection</h2>
      <p class="mb-4 sm:mb-6">Before you even hit the road, a thorough inspection is your first line of defense. Check your tire pressure and tread depth. Under-inflated tires not only reduce fuel efficiency but also increase the risk of blowouts. Don't forget to examine all fluid levels—oil, coolant, brake fluid, and windshield washer fluid. If you're renting from RentQ, rest assured our vehicles undergo rigorous multipoint inspections, but it never hurts to double-check.</p>
      
      <blockquote class="border-l-4 border-x-primary bg-x-surface2 p-5 sm:p-6 md:p-8 my-8 sm:my-10 rounded-r-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <p class="text-lg sm:text-xl md:text-2xl font-playfair italic text-white leading-relaxed">"The best road trips are the ones where the only bumps you feel are the ones on the map, not under your tires."</p>
      </blockquote>
      
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bebas text-white tracking-wide mt-10 sm:mt-12 mb-4 sm:mb-6 uppercase">2. Listen to Your Vehicle</h2>
      <p class="mb-4 sm:mb-6">Modern vehicles are equipped with sophisticated sensors, but your senses are equally important. Pay attention to any unusual noises—squealing brakes, a roaring exhaust, or a whining engine. These are early warning signs that should never be ignored. If you notice a change in how the car handles, such as pulling to one side or vibrations in the steering wheel, it might be time to pull over and seek professional assistance.</p>

      <div class="my-8 sm:my-12 overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-x-border group relative">
        <div class="absolute inset-0 bg-x-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
        <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80" alt="Driving" class="w-full h-[250px] sm:h-[300px] md:h-[450px] object-cover transition-transform duration-[2s] group-hover:scale-105" />
      </div>

      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bebas text-white tracking-wide mt-10 sm:mt-12 mb-4 sm:mb-6 uppercase">3. Master the Art of Smooth Driving</h2>
      <p class="mb-4 sm:mb-6">How you drive directly impacts the wear and tear on the vehicle. Aggressive acceleration and harsh braking generate excessive heat and wear out brake pads and tires rapidly. Aim for a smooth, consistent driving style. Use cruise control on long, flat highway stretches to maintain a steady speed and optimize fuel economy.</p>
      
      <p class="mb-4 sm:mb-6">Remember, taking care of the car ensures it takes care of you. Safe travels and enjoy the open road!</p>
    `
  };

  return (
    <div className="bg-x-bg min-h-screen text-x-text font-dm selection:bg-x-primary selection:text-white">
      <Header />
      
      {/* Cinematic Hero Header (Fully Responsive Heights) */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] flex flex-col justify-end">
        <div className="absolute inset-0">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-[#0a0b0f]/80 to-transparent opacity-90"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 relative z-10 pb-8 sm:pb-12 md:pb-16 lg:pb-24 animate-slideUp">
          <Link to="/blog" className="inline-flex items-center text-x-primary hover:text-white font-bold text-xs sm:text-sm uppercase tracking-widest mb-6 sm:mb-8 transition-colors group">
            <RiArrowLeftLine className="mr-2 text-base sm:text-lg transform group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[0.65rem] sm:text-xs font-bold uppercase tracking-[2px] shadow-lg">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[5rem] font-bebas text-white leading-[1.1] md:leading-[0.9] tracking-wide uppercase max-w-5xl mb-6 md:mb-8 drop-shadow-2xl">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border-t border-white/10 pt-6 sm:pt-8 mt-2 sm:mt-4 max-w-5xl">
            <div className="flex items-center">
              <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-x-primary shadow-[0_0_15px_rgba(221,111,39,0.3)] mr-3 sm:mr-4 object-cover" />
              <div>
                <p className="text-white font-bold text-base sm:text-lg mb-0 sm:mb-0.5">{post.authorName}</p>
                <p className="text-x-text-muted text-[0.65rem] sm:text-xs uppercase tracking-widest">{post.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-x-text-muted font-medium">
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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-12 md:py-20 flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 relative">
        {/* Ambient Glow */}
        <div className="absolute top-40 right-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-x-primary-glow rounded-full blur-[100px] md:blur-[200px] opacity-20 pointer-events-none z-0"></div>
        
        {/* Article Body */}
        <div className="w-full lg:w-2/3 xl:w-3/4 max-w-3xl lg:max-w-none mx-auto lg:mx-0 relative z-10">
          <div 
            className="prose prose-invert prose-base sm:prose-lg md:prose-xl max-w-none text-x-text-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer of the article */}
          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-x-border flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto text-center sm:text-left">
              <span className="text-white font-bebas text-xl sm:text-2xl tracking-widest uppercase">Share this</span>
              <div className="flex justify-center gap-3">
                <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-x-surface border border-x-border flex items-center justify-center text-white hover:bg-x-primary hover:border-x-primary hover:-translate-y-1 shadow-lg transition-all duration-300">
                  <RiTwitterXLine size={16} className="sm:text-[18px]" />
                </button>
                <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-x-surface border border-x-border flex items-center justify-center text-white hover:bg-[#1877F2] hover:border-[#1877F2] hover:-translate-y-1 shadow-lg transition-all duration-300">
                  <RiFacebookCircleLine size={18} className="sm:text-[20px]" />
                </button>
                <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-x-surface border border-x-border flex items-center justify-center text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:-translate-y-1 shadow-lg transition-all duration-300">
                  <RiLinkedinBoxLine size={18} className="sm:text-[20px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 xl:w-1/4 max-w-sm sm:max-w-md lg:max-w-none mx-auto lg:mx-0 relative z-10">
          <div className="sticky top-24 sm:top-28 bg-x-surface rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-x-border shadow-[0_10px_20px_rgba(0,0,0,0.2)] sm:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <h4 className="font-bebas text-2xl sm:text-3xl text-white tracking-widest uppercase mb-4 sm:mb-6 border-b border-x-border pb-3 sm:pb-4 text-center lg:text-left">About the Author</h4>
            <div className="flex flex-col items-center text-center">
              <img src={post.authorAvatar} alt={post.authorName} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-x-bg mb-3 sm:mb-4 shadow-xl object-cover" />
              <h5 className="text-lg sm:text-xl text-white font-bold mb-1">{post.authorName}</h5>
              <p className="text-x-primary text-[0.65rem] sm:text-xs font-bold uppercase tracking-[2px] sm:tracking-[3px] mb-3 sm:mb-4">{post.authorRole}</p>
              <p className="text-xs sm:text-sm text-x-text-muted leading-relaxed mb-5 sm:mb-6">
                Passionate automotive journalist and road trip enthusiast. Exploring the world one mile at a time and sharing expert tips for the ultimate driving experience.
              </p>
              <Link to="/blog" className="w-full py-2.5 sm:py-3 bg-transparent border border-x-primary text-x-primary hover:bg-x-primary hover:text-white font-bold text-[0.65rem] sm:text-xs uppercase tracking-widest rounded-full transition-colors text-center inline-block">
                View all articles
              </Link>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};
