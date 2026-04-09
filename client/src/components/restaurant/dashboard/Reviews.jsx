import { Star, ThumbsUp, MessageCircle } from "lucide-react";

const reviews = [
  { id: 1, customer: "Aarav S.", avatar: "AS", rating: 5, comment: "Absolutely delicious Momo! Fresh and perfectly spiced. Delivery was quick too. Will definitely order again.", item: "Chicken Momo", date: "2 hours ago", helpful: 4 },
  { id: 2, customer: "Priya T.", avatar: "PT", rating: 4, comment: "The Veg Thali was great, good portions and variety. Just wished the curry was a bit spicier.", item: "Veg Thali", date: "Yesterday", helpful: 2 },
  { id: 3, customer: "Rohit M.", avatar: "RM", rating: 5, comment: "Best Butter Chicken in Kathmandu! Rich, creamy and the naan was perfectly soft. Restaurant staff was very responsive.", item: "Butter Chicken", date: "2 days ago", helpful: 7 },
  { id: 4, customer: "Sita R.", avatar: "SR", rating: 3, comment: "Food was okay but arrived slightly cold. Gulab Jamun was good though.", item: "Gulab Jamun", date: "3 days ago", helpful: 1 },
  { id: 5, customer: "Bikash G.", avatar: "BG", rating: 5, comment: "Wonderful experience! The Masala Chai was authentic and the Momo was freshly made. 10/10.", item: "Chicken Momo", date: "4 days ago", helpful: 5 },
];

const ratingDist = [
  { stars: 5, count: 148, pct: 72 },
  { stars: 4, count: 38, pct: 18 },
  { stars: 3, count: 16, pct: 8 },
  { stars: 2, count: 4, pct: 2 },
  { stars: 1, count: 2, pct: 1 },
];

function Stars({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Customer Reviews</h2>
        <p className="text-sm text-gray-500 mt-0.5">208 total reviews</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-800">4.8</p>
            <Stars rating={5} size={16} />
            <p className="text-xs text-gray-400 mt-1">208 reviews</p>
          </div>
          <div className="flex-1 w-full space-y-2">
            {ratingDist.map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-4 text-right">{r.stars}</span>
                <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-6">{r.count}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:text-right">
            <div className="bg-emerald-50 text-emerald-700 rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-bold">96%</p>
              <p className="text-xs">Positive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                {r.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">{r.customer}</span>
                    <span className="text-xs text-gray-400 ml-2">{r.date}</span>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="text-xs text-indigo-500 mt-0.5">Ordered: {r.item}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    <ThumbsUp size={12} /> Helpful ({r.helpful})
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    <MessageCircle size={12} /> Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
