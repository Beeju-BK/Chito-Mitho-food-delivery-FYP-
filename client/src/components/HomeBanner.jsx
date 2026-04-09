
import banner from "../assets/banner.jpg"
const HomeBanner = () => {
  return (
    <div>
      {/* banner */}
      <div className="relative w-full h-[95vh] flex items-center justify-center">

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={banner}
            alt="Food Delivery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Delicious Food,
            <span className="text-orange-500"> Delivered Fast</span>
          </h1>

          <p className="mt-6 text-gray-200 text-lg md:text-xl">
            Order from your favorite restaurants and get fresh meals delivered
            right to your doorstep in minutes.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition duration-300">
              Order Now
            </button>

            <button className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300">
              Explore Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeBanner
