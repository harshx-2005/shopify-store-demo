import { useState, useEffect, useRef } from "react";

/**
 * Speech Recognition Hook (Voice-to-Text)
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser compatibility
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0]?.[0]?.transcript || "";
      setTranscript(resultText);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = (lang = "en-IN") => {
    if (!recognitionRef.current) return;
    setTranscript("");
    recognitionRef.current.lang = lang;
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Speech recognition already started:", e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error("Failed to stop speech recognition:", e);
    }
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    setTranscript,
  };
}

/**
 * Speech Synthesis Hook (Text-to-Voice)
 */
export function useSpeechSynthesis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text: string, lang = "en-IN") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Cancel any active speech first
    window.speechSynthesis.cancel();

    if (!text) return;

    // Clean up markdown before speaking
    const cleanText = text
      .replace(/[*#_`~]/g, "") // remove formatting characters
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // replace markdown links with label only
      .replace(/<[^>]*>/g, "") // strip HTML
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;

    // Attempt to pick a natural sounding voice for the requested language
    const langVoices = voices.filter((v) => v.lang.startsWith(lang.split("-")[0]));
    if (langVoices.length > 0) {
      // Prefer Google or natural voices if available
      const naturalVoice = langVoices.find((v) => v.name.includes("Google") || v.name.includes("Natural"));
      utterance.voice = naturalVoice || langVoices[0];
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return {
    isPlaying,
    voices,
    speak,
    stopSpeaking,
  };
}
