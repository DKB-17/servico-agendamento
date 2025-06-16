"use client"

import { StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  onRatingChange?: (rating: number) => void
  size?: number
  className?: string
}

export function StarRating({ rating, maxRating = 5, onRatingChange, size = 20, className }: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1
    const isFilled = starValue <= rating
    const isHalfFilled = starValue - 0.5 === rating

    return (
      <StarIcon
        key={index}
        size={size}
        className={cn(
          "cursor-pointer",
          isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
          onRatingChange && "hover:text-yellow-500 hover:fill-yellow-500",
          className,
        )}
        onClick={() => onRatingChange && onRatingChange(starValue)}
      />
    )
  })

  return <div className="flex">{stars}</div>
}
