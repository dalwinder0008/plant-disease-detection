import React from "react";
import { Link } from "react-router-dom";
import { CameraIcon, SparklesIcon, FlaskConicalIcon } from "../components/Icons";

const howItWorks = [
  {
    title: "Capture or Upload",
    description:
      "Take a clear photo of the affected plant leaf or upload an existing image.",
    icon: CameraIcon,
    cardBg: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    iconBg: "bg-white",
  },
  {
    title: "Get Instant Analysis",
    description:
      "Our AI analyzes the image to identify diseases, pests, or nutrient deficiencies.",
    icon: SparklesIcon,
    cardBg: "bg-purple-50",
    borderColor: "border-purple-200",
    iconColor: "text-purple-600",
    iconBg: "bg-white",
  },
  {
    title: "Receive Solutions",
    description:
      "Get detailed, actionable solutions including organic and chemical treatments.",
    icon: FlaskConicalIcon,
    cardBg: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
    iconBg: "bg-white",
  },
];

const crops = [
  {
    name: "Wheat",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ysq6Vf_aDVA8fXOwmFBPBxLibnNmeWrQzOyeM0PLZ8ewPJxyWoEBPTYQpx8AyuTjwKk&usqp=CAU",
  },
  {
    name: "Rice",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3xXjEna_HRDzysEYVfMmmqtQmiEYvTM0hPg&s",
  },
  {
    name: "Tomato",
    img: "https://png.pngtree.com/thumb_back/fh260/background/20220624/pngtree-tomato-plant-crude-horizontal-crop-photo-image_7524526.jpg",

  },
  {
    name: "Potato",
    img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Corn",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVwPv-IqxRyH6fp3qVy_Yh7c7Y1pOKVpsj1A&s",
  },
  {
    name: "Onion",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8q08WhpczEznhtGN8yMjO4H4QJtfm351g9w&s",
  },
  {
    name: "Cabbage",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYs7k4c8ZGtJA4lOTRB_uZtE1hz23RiosdDA&s",
  },
  {
    name: "Carrot",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvDz8kfsIUfbnJ2UgxFdltG6YCT4Rwce1UdQ&s",
  },
  {
    name: "Eggplant",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTth8eFKwzKp4QxV2zYxMHAZMDQ3KFBAsI9Cg&s",
  },
  {
    name: "Cucumber",
    img: "https://cdn-ilbieip.nitrocdn.com/xqwDdPehmVtcySpgjQnaFLFbBZtNqOso/assets/images/optimized/rev-1562a4e/www.harvst.co.uk/wp-content/uploads/2022/04/cucumbers-scaled.jpeg",
  },
  {
    name: "Pumpkin",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWpVX5xrXqptcVk8TdAylqQRzm0PxidthTjg&s",
  },
  {
    name: "Sugarcane",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Npla08qaQUH-75zHGEY8O9diTCVRgWvuNg&s",

    iconColor: "text-green-600",
    iconBg: "bg-white",
  },
];

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Protect Your Crops, Secure Your Future.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Instantly identify plant diseases with a single photo. Get expert-level
          solutions and boost your farm's profitability.
        </p>
        <Link
          to="/check-disease"
          className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-green-700 transition-transform transform hover:scale-105"
        >
          <CameraIcon className="w-6 h-6 mr-3" />
          Start Disease Scan
        </Link>
      </section>

      {/* How It Works Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {howItWorks.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={`${step.cardBg} ${step.borderColor} p-8 rounded-xl shadow-sm border flex flex-col items-center hover:shadow-md transition transform hover:-translate-y-1`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm ${step.iconBg} ${step.iconColor}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-700 text-center leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Crop Gallery Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Supporting a Wide Variety of Crops
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-2">
            Our AI is trained to recognize diseases in many common crops grown by
            farmers across India.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {crops.map((crop) => (
            <div
              key={crop.name}
              className="w-full h-48 rounded-xl overflow-hidden group relative hover:scale-105 transition-transform duration-300"
            >
              <img
                src={crop.img}
                alt={crop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-3">
                <p className="text-white font-bold text-base">{crop.name}</p>
              </div>
            </div>
          ))}
        </div> 
      </section>
    </div>
  );
};

export default Home;