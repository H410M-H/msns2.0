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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        {/* Tab Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeTab === index
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
          <div className="w-full scrollArea max-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-col sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tabs[activeTab]?.content}
          </div>
        </div>
    </div>
  );
}