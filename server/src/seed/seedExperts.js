require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Expert = require("../models/Expert");
const Booking = require("../models/Booking");

const today = new Date();
const nextDays = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

const experts = [
  {
    name: "Priya Sharma",
    category: "Career",
    experience: 8,
    rating: 4.9,
    bio: "Senior HR consultant and career coach with experience at top MNCs. Specialises in resume building, interview prep, and career transitions.",
    price: 1200,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Priya",
    availability: [
      { date: nextDays(1), slots: ["10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"] },
      { date: nextDays(2), slots: ["09:00 AM", "11:00 AM", "03:00 PM"] },
      { date: nextDays(5), slots: ["10:00 AM", "01:00 PM", "05:00 PM"] },
    ],
  },
  {
    name: "Rahul Menon",
    category: "Career",
    experience: 12,
    rating: 4.7,
    bio: "Ex-Google engineering manager turned career consultant. Helps software engineers crack FAANG interviews and negotiate offers.",
    price: 1800,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Rahul",
    availability: [
      { date: nextDays(1), slots: ["09:00 AM", "12:00 PM", "03:00 PM"] },
      { date: nextDays(3), slots: ["10:00 AM", "02:00 PM", "04:00 PM"] },
      { date: nextDays(6), slots: ["11:00 AM", "01:00 PM", "05:00 PM"] },
    ],
  },
  {
    name: "Ananya Iyer",
    category: "Finance",
    experience: 10,
    rating: 4.8,
    bio: "SEBI-registered investment advisor. Expert in personal finance, mutual funds, and retirement planning for young professionals.",
    price: 1500,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Ananya",
    availability: [
      { date: nextDays(2), slots: ["10:00 AM", "11:00 AM", "02:00 PM"] },
      { date: nextDays(4), slots: ["09:00 AM", "12:00 PM", "04:00 PM"] },
      { date: nextDays(7), slots: ["10:00 AM", "02:00 PM", "05:00 PM"] },
    ],
  },
  {
    name: "Vikram Nair",
    category: "Finance",
    experience: 15,
    rating: 4.6,
    bio: "Chartered Accountant with 15 years of experience in tax planning, GST compliance, and corporate finance advisory.",
    price: 2000,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Vikram",
    availability: [
      { date: nextDays(1), slots: ["11:00 AM", "01:00 PM", "03:00 PM"] },
      { date: nextDays(3), slots: ["10:00 AM", "12:00 PM", "04:00 PM"] },
      { date: nextDays(5), slots: ["09:00 AM", "02:00 PM", "05:00 PM"] },
    ],
  },
  {
    name: "Dr. Meera Patel",
    category: "Health",
    experience: 14,
    rating: 4.9,
    bio: "Certified nutritionist and lifestyle medicine physician. Helps patients with diet planning, weight management, and chronic disease prevention.",
    price: 1600,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Meera",
    availability: [
      { date: nextDays(1), slots: ["08:00 AM", "10:00 AM", "12:00 PM", "03:00 PM"] },
      { date: nextDays(2), slots: ["09:00 AM", "11:00 AM", "04:00 PM"] },
      { date: nextDays(4), slots: ["10:00 AM", "01:00 PM", "05:00 PM"] },
    ],
  },
  {
    name: "Arjun Reddy",
    category: "Health",
    experience: 7,
    rating: 4.5,
    bio: "Clinical psychologist specialising in anxiety, stress management, and cognitive behavioural therapy for working professionals.",
    price: 1400,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Arjun",
    availability: [
      { date: nextDays(2), slots: ["10:00 AM", "01:00 PM", "04:00 PM"] },
      { date: nextDays(3), slots: ["11:00 AM", "03:00 PM", "05:00 PM"] },
      { date: nextDays(6), slots: ["09:00 AM", "12:00 PM", "02:00 PM"] },
    ],
  },
  {
    name: "Adv. Suresh Kumar",
    category: "Legal",
    experience: 18,
    rating: 4.7,
    bio: "Senior advocate with expertise in corporate law, startup legal compliance, intellectual property, and contract drafting.",
    price: 2500,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Suresh",
    availability: [
      { date: nextDays(1), slots: ["10:00 AM", "12:00 PM", "03:00 PM"] },
      { date: nextDays(4), slots: ["11:00 AM", "02:00 PM", "04:00 PM"] },
      { date: nextDays(7), slots: ["10:00 AM", "01:00 PM", "05:00 PM"] },
    ],
  },
  {
    name: "Kavitha Raghavan",
    category: "Legal",
    experience: 9,
    rating: 4.4,
    bio: "Employment law specialist advising employees on workplace rights, termination disputes, and HR compliance matters.",
    price: 1800,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Kavitha",
    availability: [
      { date: nextDays(2), slots: ["09:00 AM", "11:00 AM", "03:00 PM"] },
      { date: nextDays(3), slots: ["10:00 AM", "01:00 PM", "04:00 PM"] },
      { date: nextDays(5), slots: ["11:00 AM", "02:00 PM", "05:00 PM"] },
    ],
  },
  {
    name: "Nikhil Joshi",
    category: "Technology",
    experience: 11,
    rating: 4.8,
    bio: "Full-stack developer and system design expert. Mentor for engineers preparing for senior roles at product companies.",
    price: 1600,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Nikhil",
    availability: [
      { date: nextDays(1), slots: ["09:00 AM", "11:00 AM", "02:00 PM", "05:00 PM"] },
      { date: nextDays(2), slots: ["10:00 AM", "01:00 PM", "04:00 PM"] },
      { date: nextDays(6), slots: ["11:00 AM", "03:00 PM", "05:00 PM"] },
    ],
  },
  {
    name: "Divya Krishnan",
    category: "Technology",
    experience: 6,
    rating: 4.6,
    bio: "AI/ML engineer from IIT Bombay. Guides students and professionals into data science careers and machine learning projects.",
    price: 1400,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Divya",
    availability: [
      { date: nextDays(1), slots: ["10:00 AM", "12:00 PM", "03:00 PM"] },
      { date: nextDays(3), slots: ["09:00 AM", "11:00 AM", "04:00 PM"] },
      { date: nextDays(5), slots: ["01:00 PM", "03:00 PM", "05:00 PM"] },
    ],
  },
  {
    name: "Prof. Rajan Verma",
    category: "Education",
    experience: 20,
    rating: 4.9,
    bio: "IIT alumnus and educator with two decades of experience coaching students for JEE, UPSC, and competitive examinations.",
    price: 1000,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Rajan",
    availability: [
      { date: nextDays(2), slots: ["08:00 AM", "10:00 AM", "12:00 PM", "03:00 PM"] },
      { date: nextDays(4), slots: ["09:00 AM", "11:00 AM", "02:00 PM"] },
      { date: nextDays(6), slots: ["10:00 AM", "01:00 PM", "04:00 PM"] },
    ],
  },
  {
    name: "Sneha Bhat",
    category: "Education",
    experience: 8,
    rating: 4.7,
    bio: "Study abroad consultant and IELTS/GRE trainer. Has helped 500+ students secure admissions in top universities across US, UK, and Canada.",
    price: 1200,
    image: "https://api.dicebear.com/8.x/avataaars/svg?seed=Sneha",
    availability: [
      { date: nextDays(1), slots: ["10:00 AM", "01:00 PM", "04:00 PM"] },
      { date: nextDays(3), slots: ["11:00 AM", "02:00 PM", "05:00 PM"] },
      { date: nextDays(5), slots: ["09:00 AM", "12:00 PM", "03:00 PM"] },
    ],
  },
];

const seed = async () => {
  let exitCode = 0;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[seed] Connected to MongoDB");

    await Booking.deleteMany({});
    console.log("[seed] Cleared existing bookings");

    await Expert.deleteMany({});
    console.log("[seed] Cleared existing experts");

    const created = await Expert.insertMany(experts);
    console.log(`[seed] Seeded ${created.length} experts successfully`);
  } catch (err) {
    exitCode = 1;
    console.error("[seed] Seed error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("[seed] MongoDB connection closed");
    process.exit(exitCode);
  }
};

seed();
