import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { Mic, MicOff, Volume2, VolumeX, Radio } from "lucide-react";

// Type definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function NeuralAudio() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      const preferred =
        availableVoices.find(
          (v) => v.name.includes("Google") || v.lang.includes("en"),
        ) || availableVoices[0];
      setSelectedVoice(preferred);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Initialize Speech Recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript
          .toLowerCase()
          .trim();

        console.log("VOICE COMMAND RECEIVED:", transcript);

        if (
          transcript.includes("telemetry") ||
          transcript.includes("dashboard")
        ) {
          window.dispatchEvent(
            new CustomEvent("VOICE_COMMAND", { detail: "TELEMETRY" }),
          );
          speak("Switching to telemetry dashboard");
        } else if (
          transcript.includes("simulation") ||
          transcript.includes("game")
        ) {
          window.dispatchEvent(
            new CustomEvent("VOICE_COMMAND", { detail: "SIMULATION" }),
          );
          speak("Initializing simulation environment");
        } else if (transcript.includes("mute")) {
          setIsMuted(true);
        } else if (
          transcript.includes("unmute") ||
          transcript.includes("speak")
        ) {
          setIsMuted(false);
          speak("Audio systems online");
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        // Auto-restart if it was supposed to be listening
        if (isListening) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isListening]);

  const speak = useCallback(
    (text: string) => {
      if (isMuted || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = 1.1;
      utterance.pitch = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isMuted, selectedVoice],
  );

  useEffect(() => {
    (window as any).neuralSpeak = speak;
    return () => {
      delete (window as any).neuralSpeak;
    };
  }, [speak]);

  const toggleMute = () => {
    if (!isMuted) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        speak("Voice command interface activated.");
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`w-12 h-12 rounded-none border-2 flex items-center justify-center transition-all shadow-[0_0_10px_currentColor] ${
          isListening
            ? "bg-magenta-900/30 border-magenta-500 text-magenta-400"
            : "bg-black/80 border-gray-600 text-gray-500 hover:border-magenta-500 hover:text-magenta-400"
        }`}
        title={
          isListening ? "VOICE_COMMAND: ACTIVE" : "VOICE_COMMAND: INACTIVE"
        }
      >
        {isListening ? (
          <Mic className="w-5 h-5 animate-pulse" />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMute}
        className={`w-12 h-12 rounded-none border-2 flex items-center justify-center transition-all shadow-[0_0_10px_currentColor] ${
          isMuted
            ? "bg-red-900/30 border-red-500 text-red-500"
            : "bg-cyan-900/30 border-cyan-500 text-cyan-400"
        }`}
        title={isMuted ? "NEURAL_LINK: OFFLINE" : "NEURAL_LINK: ONLINE"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </motion.button>

      {!isMuted && isSpeaking && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-black/80 border border-cyan-500/50 px-3 py-1 text-[10px] font-display text-cyan-400 uppercase tracking-widest flex items-center gap-2"
        >
          <Radio className="w-3 h-3 animate-pulse text-magenta-500" />
          TRANSMITTING...
        </motion.div>
      )}
    </div>
  );
}
