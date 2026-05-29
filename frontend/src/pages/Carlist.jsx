import React from 'react';
import { FaUserFriends, FaSuitcase, FaSnowflake, FaCog, FaLock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { LiaCarSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';

const cars = [
  {
    id: 1,
    name: 'Toyota Corolla',
    type: 'Economy Sedan',
    price: 38,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600',
    seats: 5,
    bags: 2,
    ac: 'AC',
    transmission: 'Auto'
  },
  {
    id: 2,
    name: 'Honda CR-V',
    type: 'Compact SUV',
    price: 65,
    image: 'https://images.unsplash.com/photo-1568844293986-8d0400ba4792?auto=format&fit=crop&q=80&w=600',
    seats: 5,
    bags: 4,
    ac: 'AC',
    transmission: 'Auto'
  },
  {
    id: 3,
    name: 'BMW 5 Series',
    type: 'Luxury Sedan',
    price: 129,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600',
    seats: 5,
    bags: 3,
    ac: 'Climate',
    transmission: 'Auto'
  },
  {
    id: 4,
    name: 'Chrysler Pacifica',
    type: 'Minivan',
    price: 75,
    image: 'https://images.unsplash.com/photo-1629897048514-3dd741542dd7?auto=format&fit=crop&q=80&w=600',
    seats: 7,
    bags: 5,
    ac: 'Dual AC',
    transmission: 'Auto'
  },
  {
    id: 5,
    name: 'Hyundai Elantra',
    type: 'Compact Sedan',
    price: 35,
    image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=600',
    seats: 5,
    bags: 2,
    ac: 'AC',
    transmission: 'Auto'
  },
  {
    id: 6,
    name: 'Jeep Grand Cherokee',
    type: 'Full-size SUV',
    price: 89,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
    seats: 7,
    bags: 5,
    ac: 'Dual AC',
    transmission: 'Manual'
  }
];

const Carlist = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 font-sans font-dm">
      {/* Header Banner Section */}
      <div className="relative h-[250px] md:h-[300px] w-full bg-cover bg-center flex items-center justify-start px-6 md:px-20"
           style={{ backgroundImage: 'linear-gradient(to right, rgba(10, 10, 10, 0.95) 20%, rgba(10, 10, 10, 0.2) 100%), url("https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=2000")' }}>
        <div className="z-10 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Vehicles</h1>
          <div className="text-sm font-medium tracking-widest flex items-center gap-2">
             <Link to="/" className="text-orange-500 hover:text-orange-400 font-bold text-xs uppercase">Home</Link>
             <span className="text-white/20">|</span>
             <span className="text-white/50 text-xs uppercase">Vehicles</span>
          </div>
        </div>
        
        {/* Floating Car Graphic */}
        {/* <div className="absolute right-10 bottom-[-20px] hidden md:flex w-48 h-24 bg-[#131313] rounded-t-3xl shadow-xl shadow-black/50 border-t border-x border-white/5 items-center justify-center pt-2 overflow-hidden">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/car-6369986-5259902.png" alt="car graphic" className="w-40 object-contain drop-shadow-[0_4px_10px_rgba(255,255,255,0.1)] pb-4" />
        </div> */}
      </div>

      {/* Main Content Section */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Title & Subtitle */}
        <div className="text-center mb-10 animate-slideUp">
          <span className="text-orange-500 text-[16px] font-bold  block mb-3">Our Luxury Vehicles</span>
          <h2 className="text-xl md:text-2xl font-bold text-white/90 max-w-2xl mx-auto leading-snug">
            Discover our meticulously maintained fleet of premium vehicles, each designed to provide the ultimate comfort and style for your journey.
          </h2>
        </div>

        {/* Filter Section */}
        <div className="bg-[#131313] rounded-2xl p-5 mb-14 shadow-lg shadow-black/20 border border-white/5 animate-slideUp" style={{animationDelay: "0.1s"}}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vehicle Type */}
            <div className="flex flex-col">
              <label className="text-[12px] font-[600] text-white/40 capitalize mb-2 ml-1">Vehicle Type</label>
              <select className="px-5 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer hover:border-white/20 transition-colors">
                <option>All Vehicles</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Luxury</option>
              </select>
            </div>
            
            {/* Price Range */}
            <div className="flex flex-col">
              <label className="text-[12px] font-[600] text-white/40 mb-2 ml-1">Price Range</label>
              <select className="px-5 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer hover:border-white/20 transition-colors">
                <option>Any Price</option>
                <option>Under $50</option>
                <option>$50 - $100</option>
                <option>Over $100</option>
              </select>
            </div>

            {/* Passenger Capacity */}
            <div className="flex flex-col">
              <label className="text-[12px] font-[600] text-white/40 mb-2 ml-1">Passenger Capacity</label>
              <select className="px-5 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer hover:border-white/20 transition-colors">
                <option>Any Capacity</option>
                <option>2 Seats</option>
                <option>4-5 Seats</option>
                <option>7+ Seats</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex flex-col">
              <label className="text-[12px] font-[600] text-white/40 mb-2 ml-1">Sort By</label>
              <select className="px-5 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer hover:border-white/20 transition-colors">
                <option>Default</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, idx) => (
            <div key={car.id} className="bg-[#131313] rounded-[4px] overflow-hidden border border-white/50 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 flex flex-col group p-2 animate-slideUp" style={{animationDelay: (0.15 + (idx * 0.05)) + 's'}}>
              {/* Car Image */}
              <div className="h-[200px] overflow-hidden relative rounded-[4px] bg-black/50">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100"
                  />
              </div>
              
              {/* Car Details */}
              <div className="py-4 px-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-[20px] font-bold text-white/90">{car.name}</h3>
                    <p className="text-[14px] text-white/40 font-medium mt-0.5">{car.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[20px] font-[600] text-orange-500">${car.price}</span>
                    <p className="text-[12px] text-white/30 font-bold">Per day</p>
                  </div>
                </div>


                {/* Features */}
                <div className="grid grid-cols-4 gap-2 mb-6 px-2">
                  <div className="flex flex-col items-center justify-center text-center">
                    <FaUserFriends className="text-white/20 mb-2 text-base group-hover:text-orange-500/60 transition-colors" />
                    <span className="text-[10px] font-medium text-white/50">{car.seats} Seats</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <FaSuitcase className="text-white/20 mb-2 text-base group-hover:text-orange-500/60 transition-colors" />
                    <span className="text-[10px] font-medium text-white/50">{car.bags} Bags</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <FaSnowflake className="text-white/20 mb-2 text-base group-hover:text-orange-500/60 transition-colors" />
                    <span className="text-[10px] font-medium text-white/50">{car.ac}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <FaCog className="text-white/20 mb-2 text-base group-hover:text-orange-500/60 transition-colors" />
                    <span className="text-[10px] font-medium text-white/50">{car.transmission}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-auto">
                  <button className="flex-[1.2] bg-btn-orange hover:bg-btn-orange-hover text-white font-[600] py-2 px-4 rounded-[4px] text-[14px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]">
                    Rent Now <div className="bg-white/10 text-white p-1 rounded backdrop-blur-sm"><LiaCarSolid size={18} /></div>
                  </button>
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-white/80 font-[600] py-2 px-4 rounded-[4px] text-[14px] transition-all text-center border border-white/10 hover:border-white/20">
                    See Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-16 animate-slideUp" style={{animationDelay: '0.4s'}}>
          <button className="w-9 h-9 rounded-lg bg-[#131313] border border-white/5 flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-white/80 transition-colors">
            <FaChevronLeft size={10} />
          </button>
          
          <button className="w-9 h-9 rounded-lg bg-btn-orange flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-orange-500/30 border border-orange-500/50">
            1
          </button>
          <button className="w-9 h-9 rounded-lg bg-[#131313] border border-white/5 flex items-center justify-center text-white/60 text-xs font-semibold hover:bg-white/5 hover:text-white/90 transition-colors">
            2
          </button>
          <button className="w-9 h-9 rounded-lg bg-[#131313] border border-white/5 flex items-center justify-center text-white/60 text-xs font-semibold hover:bg-white/5 hover:text-white/90 transition-colors">
            3
          </button>
          
          <button className="w-9 h-9 rounded-lg bg-[#131313] border border-white/5 flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-white/80 transition-colors">
            <FaChevronRight size={10} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Carlist;