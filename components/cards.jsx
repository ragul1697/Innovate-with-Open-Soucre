"use client";

import React, { useState, useRef, useEffect } from "react";
import { contributors } from "@/lib/data";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component from Shadcn

const ITEMS_PER_PAGE = 9; // Display 3 cards per page

const FeatureCard = ({ name, role, image, github }) => (
  <div
    className="bg-white p-6 h-56 border border-dashed rounded-lg shadow-sm relative overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg"
    style={{
      backgroundImage: "url('/cardbg.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="absolute inset-0 bg-grid-gray-100 opacity-50"></div>
    <div className="relative flex flex-col justify-between h-full z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="h-20 w-20">
          <img
            src={image}
            alt={name}
            className="h-20 w-20 rounded-full"
            onError={(e) => {
              e.target.src = "https://avatar.iran.liara.run/public/24";
            }}
          />
        </div>
      </div>
      <div className="">
        <h3 className="text-xl font-bold mt-4">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-200 px-1"
          >
            {name}
          </a>
        </h3>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
  </div>
);

const InfiniteScrollCard = ({ name, image }) => (
  <div className="flex-shrink-0 w-20 mx-2">
    <img
      src={image}
      alt={name}
      className="w-20 h-20 rounded-full"
      onError={(e) => {
        e.target.src = "https://avatar.iran.liara.run/public/24";
      }}
    />
    <p className="text-xs text-center mt-2 truncate">{name}</p>
  </div>
);

export default function Cards() {
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef(null);

  const totalItems = contributors.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentContributors = contributors.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const scrollWidth = scrollContainer.scrollWidth / 2; // Divide by 2 because we duplicated the content
      const clientWidth = scrollContainer.clientWidth;

      const timer = setInterval(() => {
        setScrollPosition((prevPos) => {
          if (prevPos >= scrollWidth) {
            // If we've scrolled past the first set, instantly jump back to the start of the second set
            scrollContainer.scrollLeft = 0;
            return 0;
          }
          return prevPos + 1;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <section id="contributors" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Contributors</h2>

        {/* Infinite Scroll Section */}
        <div className="mb-12 overflow-hidden">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide smooth-scroll"
            style={{ scrollBehavior: 'smooth' }}
          >
            {[...contributors, ...contributors].map((contributor, index) => (
              <InfiniteScrollCard key={index} name={contributor.name} image={contributor.image} />
            ))}
          </div>
        </div>

        <p className="text-center text-lg text-gray-500 mb-8">
          Total Contributors: {totalItems}
        </p>

        {/* Display the current page of contributors */}
        <div className="grid md:grid-cols-3 gap-8">
          {currentContributors.map((contributor) => (
            <FeatureCard
              key={contributor.name}
              name={contributor.name}
              role={contributor.role}
              image={contributor.image}
              github={contributor.github}
            />
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
