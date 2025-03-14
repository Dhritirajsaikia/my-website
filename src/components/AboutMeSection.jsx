import React, { useState, useEffect } from 'react';
import { Milk, CookingPot, Brush, Heart, Layers, Sparkles, Star, CheckCircle, BookOpen, Box, Users, ToyBrick} from 'lucide-react';

const AboutMeSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const bgTimer = setTimeout(() => {
      setAnimateBackground(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(bgTimer);
    };
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center">
      <div className={`max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>

        {/* Header with premium gradient */}
        <div className="relative h-72 overflow-hidden bg-gradient-to-r from-blue-900 to-orange-600">
          {/* Animated shapes */}


          {/* Sparkling stars */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 60 + 10}%`,
                animation: `twinkle ${2 + i % 3}s ease-in-out ${i % 5 * 0.5}s infinite alternate`
              }}
            >
              <Star className="text-white h-4 w-4 opacity-70" fill="rgba(255,255,255,0.7)" />
            </div>
          ))}
        </div>

        {/* Profile content */}
        <div className="relative px-6 md:px-12 pb-8 bg-gradient-to-b from-white to-gray-100">
          {/* Profile image with premium rotating border */}
          <div className="flex justify-center">
            <div className={`relative h-48 w-48 md:h-56 md:w-56 rounded-full -mt-28 mb-3 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-orange-600 animate-spin-slow"></div>
              <div className="absolute inset-1 rounded-full bg-white"></div>
              <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-white bg-white">
                <img
                  src="aboutme.jpg"
                  alt="Pranabi Baruah"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating icons around the profile picture */}
              {/* Floating icons around the profile picture */}
              {/* {[...Array(4)].map((_, i) => {
  const icons = [
    <Palette size={16} className="text-blue-600" />, 
    <Scissors size={16} className="text-orange-600" />, 
    <Package size={16} className="text-black" />, 
    <Sparkles size={16} className="text-orange-600" />
  ];
  const angle = (i * 90) + 45;
  const radian = angle * (Math.PI / 180);
  // Use a smaller distance for Scissors (i === 1) and Package (i === 2)
  const distance = (i === 1 || i === 2) ? 30 : 80;
  const x = Math.cos(radian) * distance;
  const y = Math.sin(radian) * distance;
  
  return (
    <div 
      key={`float-icon-${i}`}
      className="absolute p-2 rounded-full bg-white shadow-md"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        animation: `bounce-${i % 3} 3s ease-in-out ${i * 0.2}s infinite alternate`
      }}
    >
      {icons[i]}
    </div>
  );
})} */}

            </div>
          </div>

          {/* Name and title */}
          <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-600">Pranabi Baruah</h1>
            <h2 className="text-xl md:text-2xl font-medium text-blue-600 mt-1">
              Artisan &amp; Creative Designer
              <span className="inline-block ml-2 animate-bounce">✨</span>
            </h2>
            {/* <p className="text-gray-600 mt-2 max-w-lg mx-auto">
              Turning imagination into handcrafted treasures for over 25 years
            </p> */}
          </div>

          <div className={`mt-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
  <div className="w-full max-w-2xl mx-auto space-y-6 p-4 sm:p-6 rounded-xl">
  
    
    <div className={`mt-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
  <div className="w-full max-w-2xl mx-auto space-y-6 p-4 sm:p-6 rounded-xl bg-gradient-to-br from-white to-gray-100 shadow-md border border-gray-200 -my-15">
    <p className="text-gray-700 text-sm sm:text-base">
      With over 24 years of full-time experience in Art &amp; Craft, I am here to help you turn your passion into skill and your creativity into success! Whether you are a beginner or an expert looking to refine your craft, my courses and products are designed to inspire, educate, and elevate your artistic journey.
    </p>
    
    <div className="text-gray-700 text-sm sm:text-base">
      <h3 className="font-semibold mb-2">Why Learn from Me?</h3>
      <ul className="space-y-2">
        <li className="flex items-center">
          <span className="flex items-center justify-center w-5 h-5 mr-2">
            <CheckCircle size={18} className="text-green-500" />
          </span>
          Certified Expert &amp; Master Trainer by the Indian Institute of Entrepreneurship (Govt. of India)
        </li>
        <li className="flex items-center">
          <span className="flex items-center justify-center w-5 h-5 mr-2">
            <CheckCircle size={18} className="text-green-500" />
          </span>
          State Awardee in Art &amp; Craft (Govt. of Assam)
        </li>
        <li className="flex items-center">
          <span className="flex items-center justify-center w-5 h-5 mr-2">
            <CheckCircle size={18} className="text-green-500" />
          </span>
          Super Teacher at Pidilite Industries Ltd. (Mumbai)
        </li>
        <li className="flex items-center">
          <span className="flex items-center justify-center w-5 h-5 mr-2">
            <CheckCircle size={18} className="text-green-500" />
          </span>
          Organizer &amp; Exhibitor of Art &amp; Craft across entire North-East
        </li>
      </ul>
    </div>
    
    <div className="text-gray-700 text-sm sm:text-base">
      <h3 className="font-semibold mb-2">What I Offer</h3>
      <ul className="space-y-2">
        <li className="flex items-center">
          <span className="flex items-center justify-center w-5 h-5 mr-2">
            <BookOpen size={18} className="text-blue-500" />
          </span>
          Exclusive Art &amp; Craft Courses – Learn step-by-step from a certified expert
        </li>
        <li className="flex items-center">
          <span className="flex items-center justify-center w-5 h-5 mr-2">
            <Box size={18} className="text-purple-500" />
          </span>
          Premium Handmade Products &amp; DIY Kits – Perfect for beginners &amp; professionals
        </li>
        <li className="flex items-center">
          <span className="flex items-center justify-center w-5 h-5 mr-2">
            <Users size={18} className="text-orange-500" />
          </span>
          Workshops &amp; Training Programs – Hands-on learning for all age groups
        </li>
      </ul>
    </div>
  </div>
</div>
    
    
  </div>
</div>


          {/* Specialties with premium cards */}
          <div className={`mt-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            <h3 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-600 my-20">My Specialties</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {/* Paper Crafting */}
              <div className="rounded-xl shadow-xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="h-3 bg-gradient-to-r from-blue-600 to-orange-600"></div>
                <div className="p-4 sm:p-6 ">
                  <div className="flex justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 shadow-lg">
                      <CookingPot className="text-white h-8 w-8" />
                    </div>
                  </div>
                  <h4 className="font-bold text-xl text-center text-blue-800">Pot Painting</h4>
                  <p className="text-gray-600 text-center mt-2">Stir Up Your Creative Pot</p>
                </div>
              </div>

              {/* Resin Art */}
              <div className="rounded-xl shadow-xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="h-3 bg-gradient-to-r from-blue-600 to-orange-600"></div>
                <div className="p-4 sm:p-6">
                  <div className="flex justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 shadow-lg">
                      <Milk className="text-white h-8 w-8" />
                    </div>
                  </div>
                  <h4 className="font-bold text-xl text-center text-blue-800">Bottle Designing </h4>
                  <p className="text-gray-600 text-center mt-2">Craft Your Bottle Masterpiece</p>
                </div>
              </div>

              {/* Custom Gifts */}
              <div className="rounded-xl shadow-xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="h-3 bg-gradient-to-r from-blue-600 to-orange-600"></div>
                <div className="p-4 sm:p-6 ">
                  <div className="flex justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 shadow-lg">
                      <Layers className="text-white h-8 w-8" />
                    </div>
                  </div>
                  <h4 className="font-bold text-xl text-center text-blue-800">Block Print</h4>
                  <p className="text-gray-600 text-center mt-2">Carve Your Bold Imprint</p>
                </div>
              </div>

              {/* Digital Design */}
              <div className="rounded-xl shadow-xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="h-3 bg-gradient-to-r from-blue-600 to-orange-600"></div>
                <div className="p-4 sm:p-6 ">
                  <div className="flex justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 shadow-lg">
                      <Star className="text-white h-8 w-8" />
                    </div>
                  </div>
                  <h4 className="font-bold text-xl text-center text-blue-800">Fabric Painting</h4>
                  <p className="text-gray-600 text-center mt-2">Innovative fabric creations</p>
                </div>
              </div>

              {/* Creative Illustration */}
              <div className="rounded-xl shadow-xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="h-3 bg-gradient-to-r from-blue-600 to-orange-600"></div>
                <div className="p-4 sm:p-6">
                  <div className="flex justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 shadow-lg">
                      <Brush className="text-white h-8 w-8" />
                    </div>
                  </div>
                  <h4 className="font-bold text-xl text-center text-blue-800">Glass Painting </h4>
                  <p className="text-gray-600 text-center mt-2">Color Your Glass Vision</p>
                </div>
              </div>

              {/* Artisan Workshops */}
              <div className="rounded-xl shadow-xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="h-3 bg-gradient-to-r from-blue-600 to-orange-600"></div>
                <div className="p-4 sm:p-6 ">
                  <div className="flex justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 shadow-lg">
                      <ToyBrick className="text-white h-8 w-8" />
                    </div>
                  </div>
                  <h4 className="font-bold text-xl text-center text-blue-800">Stencil Work</h4>
                  <p className="text-gray-600 text-center mt-2">Stencils That Inspire Creativity</p>
                </div>
              </div>
            </div>
          </div>


          {/* Connect Section
          // <div className={`mt-16 text-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
          //   <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-600 mb-8">Let's Connect</h3>
            
          //   <div className="flex justify-center space-x-8">
          //     <a href="#" className="flex flex-col items-center group">
          //       <div className="relative h-16 w-16 transform group-hover:scale-110 transition-all duration-300">
          //         <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-105"></div>
          //         <div className="absolute inset-0 rounded-full bg-gray-100 group-hover:bg-white transition-all duration-300 flex items-center justify-center">
          //           <Mail className="text-blue-600 h-8 w-8 group-hover:text-blue-500 transition-colors" />
          //         </div>
          //       </div>
          //       <span className="mt-2 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">Email</span>
          //     </a>
              
          //     <a href="#" className="flex flex-col items-center group">
          //       <div className="relative h-16 w-16 transform group-hover:scale-110 transition-all duration-300">
          //         <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-105"></div>
          //         <div className="absolute inset-0 rounded-full bg-gray-100 group-hover:bg-white transition-all duration-300 flex items-center justify-center">
          //           <Instagram className="text-orange-600 h-8 w-8 group-hover:text-orange-500 transition-colors" />
          //         </div>
          //       </div>
          //       <span className="mt-2 text-sm font-medium text-orange-600 group-hover:text-orange-700 transition-colors">Instagram</span>
          //     </a>
              
          //     <a href="#" className="flex flex-col items-center group">
          //       <div className="relative h-16 w-16 transform group-hover:scale-110 transition-all duration-300">
          //         <div className="absolute inset-0 rounded-full bg-gradient-to-br from-black to-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-105"></div>
          //         <div className="absolute inset-0 rounded-full bg-gray-100 group-hover:bg-white transition-all duration-300 flex items-center justify-center">
          //           <Facebook className="text-white h-8 w-8 group-hover:text-white transition-colors" />
          //         </div>
          //       </div>
          //       <span className="mt-2 text-sm font-medium text-white group-hover:text-white transition-colors">Facebook</span>
          //     </a>
          //   </div>
          // </div> */}
        </div>

        {/* Footer */}
        <div className={`py-8 px-6 bg-gradient-to-r from-blue-900 to-orange-600 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white text-lg font-medium italic">
            "Art and craft give hands a voice and imagination a form "
          </p>
          <div className="flex justify-center mt-3 space-x-2">
            {[...Array(5)].map((_, i) => (
              <Sparkles
                key={i}
                className="text-yellow-200 h-4 w-4"
                style={{
                  animation: `twinkle ${1 + i % 3}s ease-in-out ${i * 0.2}s infinite alternate`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes float-0 {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-1 {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-2 {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-25px) rotate(3deg); }
        }
        @keyframes float-3 {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-10px) rotate(-3deg); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bounce-0 {
          0% { transform: translate(80px, 0px); }
          100% { transform: translate(90px, 0px); }
        }
        @keyframes bounce-1 {
          0% { transform: translate(0px, 80px); }
          100% { transform: translate(0px, 90px); }
        }
        @keyframes bounce-2 {
          0% { transform: translate(-80px, 0px); }
          100% { transform: translate(-90px, 0px); }
        }
        @keyframes twinkle {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutMeSection;
 