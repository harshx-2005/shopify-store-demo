"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function LuxuryVideo() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full h-[70vh] bg-luxury-charcoal overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-100 hover:scale-101 transition-transform duration-[4000ms]"
        src="https://player.vimeo.com/external/371433846.sd.mp4?s=231899a8e66ee735c243f789d316e6d15a5105d5&profile_id=139&oauth2_token_id=57447761"
      />

      {/* Shade overlay */}
      <div className="absolute inset-0 bg-luxury-charcoal bg-opacity-35" />

      {/* Decorative Golden Frame */}
      <div className="absolute inset-8 border border-luxury-gold border-opacity-15 pointer-events-none rounded-xl" />

      {/* Text Overlay Content */}
      <div className="relative z-10 max-w-2xl text-center space-y-6 px-6 text-luxury-cream">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold font-bold"
        >
          Slow Fashion • Human Touch
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-3xl md:text-5xl leading-tight font-medium tracking-wide"
        >
          Woven in Time, Made for Living
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans text-xs md:text-sm text-luxury-cream text-opacity-80 leading-relaxed"
        >
          Every warp and weft on our shuttle looms carries the heritage of generations. Witness the slow, intentional craftsmanship that turns organic plant yarns into luxury linens.
        </motion.p>

        {/* Video Controls Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-6 pt-4"
        >
          <button
            onClick={togglePlay}
            suppressHydrationWarning
            className="flex items-center gap-2 px-5 py-2.5 bg-luxury-warmWhite bg-opacity-10 border border-luxury-cream border-opacity-25 hover:bg-luxury-warmWhite hover:text-luxury-charcoal rounded-full text-xs font-sans tracking-widest uppercase transition-all duration-300"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Film
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" fill="currentColor" /> Play Film
              </>
            )}
          </button>

          <button
            onClick={toggleMute}
            suppressHydrationWarning
            className="p-3 bg-luxury-warmWhite bg-opacity-10 border border-luxury-cream border-opacity-25 hover:bg-luxury-warmWhite hover:text-luxury-charcoal rounded-full transition-all duration-300"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
