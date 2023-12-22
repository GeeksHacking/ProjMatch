import { useState, useEffect } from "react";
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'

export default function StarsContainer({ rating, api, postId }) {
    const [displayedRating, setDisplayedRating] = useState([0, 0, 0, 0, 0])
    const [hoveredStar, setHoveredStar] = useState(0)
    const [hasRated, setHasRated] = useState(false)
    
    useEffect(() => {
        setDisplayedRating(new Array(5).fill(0).map((_, index) => (index < Math.floor(rating[0]) ? 1 : 0)))
    }, [])

    function handleStarHover(index) {
        setHoveredStar(index)

        const temp = new Array(5).fill(0).map((_, index) => (index < Math.floor(rating[0]) ? 1 : 0))
        for (let i = 0; i < index + 1; i++) {
            temp[i] = 2;
        }

        setDisplayedRating(temp)
    }
    
    async function functionHandleRate(index) {
        if (!hasRated) {
            await api.updatePost(postId, 
                {
                    rating: [(((rating[0] * rating[1]) + (index+1))/(rating[1] + 1)), rating[1] + 1]
                })
            setHasRated(true)
        }
    }

    return (
        <div className="flex flex-row" onMouseLeave={() => setDisplayedRating(new Array(5).fill(0).map((_, index) => (index < Math.floor(rating[0]) ? 1 : 0)))}>
            {displayedRating.map((value, index) => (
                (value === 1) ?
                    <StarSolid key={index} className="w-8 h-8 fill-amber-500" onMouseEnter={() => handleStarHover(index)} onClick={() => functionHandleRate(index)} />
                :
                    value === 2 ? 
                        <StarSolid key={index} className="w-8 h-8 fill-amber-600" onMouseEnter={() => handleStarHover(index)} onClick={() => functionHandleRate(index)} />
                    : 
                        <StarOutline key={index} className="w-8 h-8" onMouseOver={() => handleStarHover(index)} onClick={() => functionHandleRate(index)} />
            ))}
        </div>
    )
}