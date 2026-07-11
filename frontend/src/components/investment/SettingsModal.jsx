import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SettingsModal({ isOpen, onClose }) {
  const [groqApiKey, setGroqApiKey] = useState("");
  const [tavilyApiKey, setTavilyApiKey] = useState("");
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [temperature, setTemperature] = useState(0.2);

  // Load configuration from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      setGroqApiKey(localStorage.getItem("groq_api_key") || "");
      setTavilyApiKey(localStorage.getItem("tavily_api_key") || "");
      setModel(localStorage.getItem("groq_model") || "llama-3.3-70b-versatile");
      setTemperature(parseFloat(localStorage.getItem("groq_temperature") || "0.2"));
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("groq_api_key", groqApiKey.trim());
    localStorage.setItem("tavily_api_key", tavilyApiKey.trim());
    localStorage.setItem("groq_model", model);
    localStorage.setItem("groq_temperature", temperature.toString());

    toast.success("Configuration saved successfully", {
      description: "Engine parameters updated for your next analysis.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[500px] border border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-md rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/40">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Analysis Engine Parameters
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Groq API Key */}
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-tight text-foreground/90">
              Groq API Key
            </label>
            <Input
              type="password"
              placeholder="gsk_... (Enter your Groq API Key)"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              className="font-mono bg-surface/50 border-border/60 focus-visible:ring-primary/50 text-foreground"
            />
            <p className="text-[11px] text-muted-foreground">
              Powers the AI language model (LLM). Leave blank to use the server default key.{" "}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                Get a free key →
              </a>
            </p>
          </div>

          {/* Tavily API Key */}
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-tight text-foreground/90">
              Tavily Search Key{" "}
              <span className="text-[10px] font-normal bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1">
                Real-time Search
              </span>
            </label>
            <Input
              type="password"
              placeholder="tvly-... (Enter your Tavily API Key)"
              value={tavilyApiKey}
              onChange={(e) => setTavilyApiKey(e.target.value)}
              className="font-mono bg-surface/50 border-border/60 focus-visible:ring-primary/50 text-foreground"
            />
            <p className="text-[11px] text-muted-foreground">
              Powers live web search for real-time news & financial data.{" "}
              <a
                href="https://app.tavily.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                Get a free key →
              </a>
            </p>
          </div>

          {/* LangChain Inference Model */}
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-tight text-foreground/90">
              Inference Analysis Model
            </label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-full bg-surface/50 border-border/60 text-foreground">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="llama-3.3-70b-versatile" className="cursor-pointer">
                  Llama 3.3 70B (Versatile)
                </SelectItem>
                <SelectItem value="llama-3.1-8b-instant" className="cursor-pointer">
                  Llama 3.1 8B (Instant)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Temperature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold tracking-tight text-foreground/90">
                Temperature (Creativity vs. Precision)
              </label>
              <span className="text-sm font-bold text-primary font-mono">
                {temperature.toFixed(1)}
              </span>
            </div>

            <Slider
              value={[temperature]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={(val) => setTemperature(val[0])}
              className="py-2"
            />

            <div className="flex justify-between text-[10px] font-medium text-muted-foreground/80 tracking-wide">
              <span>Precise / Analytical (0.0)</span>
              <span>Creative / Synthetic (1.0)</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-5 border border-border/60 hover:bg-surface/50 text-foreground/80 hover:text-foreground cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-5 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-white cursor-pointer shadow-[0_0_15px_-3px_var(--color-primary)] font-semibold"
          >
            Save Parameters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
