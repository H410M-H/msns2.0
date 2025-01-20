"use client";

import React, { useState } from "react";

export interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center bg-yellow-200/50 pt-[4rem]">
        {/* Tab Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap border-b border-green-700 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex-1 sm:flex-none px-8 py-4 text-md font-medium whitespace-nowrap transition-colors duration-200 ${
                activeTab === index
                  ? "border-current bg-green-800 border-green-600 text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-green-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
          <div className="w-full rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-col sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tabs[activeTab]?.content}
          </div>
        </div>
    </div>
  );
}