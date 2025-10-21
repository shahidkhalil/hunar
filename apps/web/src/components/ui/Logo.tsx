import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <Image
        src="/IMG_9478.jpg"
        alt="Hunar Logo"
        width={48}
        height={48}
        className="w-full h-full object-contain rounded-full"
        priority
      />
    </div>
  );
}

export function LogoWithText({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Logo size={size} />
      <div className="flex flex-col">
        <div className={`font-serif font-bold text-gray-700 ${sizeClasses[size]}`}>
          HUNAR®
        </div>
        <div className="text-xs text-gray-500 font-medium tracking-wider">
          FEMALE • WINTER
        </div>
      </div>
    </div>
  );
}
