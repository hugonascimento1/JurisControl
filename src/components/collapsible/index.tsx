"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

interface Item {
  question: React.ReactNode;
  icon: React.ElementType;
  content: React.ReactNode;
}

interface CollapsibleDemoProps {
  items: Item[];
}

export function CollapsibleDemo({ items }: CollapsibleDemoProps) {
  const [openIndexes, setOpenIndexes] = useState<boolean[]>(
    Array(items.length).fill(false)
  );

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className="w-full max-w-4xl space-y-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        const isOpen = openIndexes[index];

        return (
          <div key={index} className="border-[2px] border-gray-500 rounded-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-200 cursor-pointer" onClick={() => toggleItem(index)}>
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Icon className="h-5 w-5 text-blue-700" />
                {item.question}
              </h4>
              <Button variant="ghost" size="sm" aria-expanded={isOpen} aria-controls={`content-${index}`}>
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span className="sr-only">Toggle</span>
              </Button>
            </div>

            {/* <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`content-${index}`}
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="px-4 py-2 bg-white border border-t-0 border-gray-300 rounded-b-md overflow-hidden"
                >
                  {item.content}
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
        );
      })}
    </div>
  );
}
