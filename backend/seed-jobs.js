const mongoose = require('mongoose');
const Job = require('./server').Job;

// Sample job data
const sampleJobs = [
  {
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3-5 years",
    description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building responsive web applications using React, TypeScript, and modern CSS frameworks."
  },
  {
    title: "Backend Developer",
    department: "Engineering", 
    location: "Hybrid",
    type: "Full-time",
    experience: "2-4 years",
    description: "Join our backend team to build scalable APIs and services. Experience with Node.js, Express, MongoDB, and cloud platforms required."
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time", 
    experience: "2-3 years",
    description: "We need a creative UI/UX Designer to create beautiful and intuitive user interfaces. Proficiency in Figma, Adobe Creative Suite, and design systems required."
  },
  {
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "On-site",
    type: "Full-time",
    experience: "3-6 years",
    description: "Looking for a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, Kubernetes, and Jenkins essential."
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Hybrid",
    type: "Full-time",
    experience: "4-7 years",
    description: "We need a Product Manager to drive product strategy and development. Strong analytical skills and experience with agile methodologies required."
  }
];

async function seedJobs() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pthinkS');
    console.log('🔗 Connected to database');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️ Cleared existing jobs');

    // Insert sample jobs
    const insertedJobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Inserted ${insertedJobs.length} sample jobs:`);
    insertedJobs.forEach((job, index) => {
      console.log(`   ${index + 1}. ${job.title} - ${job.department}`);
    });

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedJobs();
