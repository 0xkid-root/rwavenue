import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-100 to-white py-20 md:py-32">
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-800 leading-tight">
              Tokenize and Trade Real-World Assets On-Chain
            </h1>
            <p className="mt-4 text-lg text-neutral-600 md:pr-12">
              Buy, sell, auction, or lend luxury watches, art, and collectibles with full transparency and control, validated by trusted experts.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="font-medium"
                icon={<ArrowRight />}
                iconPosition="right"
              >
                Explore Marketplace
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="font-medium"
              >
                Learn How to Tokenize
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg" 
                alt="Luxury watch being tokenized" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-800/40 to-transparent"></div>
              
              <motion.div 
                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-primary-800">Rolex Daytona</h3>
                    <p className="text-sm text-neutral-600">Verified by Swiss Watch Authority</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-secondary-500">30,000 USDT</p>
                    <p className="text-xs text-neutral-500">Tokenized 3 days ago</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="absolute -bottom-8 -right-8 md:-right-12 w-32 h-32 md:w-40 md:h-40 bg-secondary-500 rounded-full z-[-1]"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            
            <motion.div 
              className="absolute -top-8 -left-8 md:-left-12 w-24 h-24 md:w-32 md:h-32 bg-primary-800/30 rounded-full z-[-1]"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 6,
                delay: 1,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};