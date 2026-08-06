import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import Doctor from '../models/Doctor.js';
import Pharmacy from '../models/Pharmacy.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

const doctors = [
  {
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology',
    subSpecialties: ['Preventative Cardiology', 'Heart Failure Management', 'Echocardiography', 'Hypertension'],
    credentials: 'MD, FACC',
    rating: 4.9,
    reviewCount: 124,
    yearsExperience: 15,
    about: 'Dr. Sarah Jenkins is a board-certified cardiologist dedicated to providing compassionate, comprehensive cardiovascular care. With over 15 years of clinical experience, she specializes in preventative cardiology and the management of complex heart failure.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBSDIk7yA-y1PnWMkqhKLpSd6ekTQ1skQt5JBL6fJmPLdQj7naZqGRkYOOuLpPn6ceCT1Gg9H5ChRvuBb_ZxhjqdG2VxQHurjXyJfFKg46ttMPj-wXUe7plS_zL12eMexlSTCFsJydd9kNhuHDJhzvW1UrwOVLRFCWWppfyFL_iyT5UpfoIzqGGZWeEc3ADn7jFM-zazJE4-xt6mhT43qsLADs4xgytEqlz58v8WM_b-iH7s7LOkQ',
    languages: ['English', 'Spanish'],
    education: [
      { degree: 'Fellowship in Cardiology', institution: 'Johns Hopkins Hospital' },
      { degree: 'MD, Medicine', institution: 'Harvard Medical School' }
    ],
    location: { type: 'Point', coordinates: [-74.0060, 40.7128], address: '100 Medical Center Dr, New York, NY', city: 'New York' },
    phone: '(555) 123-4567',
    acceptingNewPatients: true,
    telehealthAvailable: true,
    consultationFee: 150,
    availability: [
      { day: 'Monday', slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] },
      { day: 'Tuesday', slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] },
      { day: 'Wednesday', slots: [{ start: '10:00', end: '15:00' }] },
      { day: 'Thursday', slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] },
      { day: 'Friday', slots: [{ start: '09:00', end: '13:00' }] }
    ],
    reviews: [
      { patientName: 'Michael J.', patientInitials: 'MJ', rating: 5, comment: 'Dr. Jenkins was incredibly thorough and took the time to explain my test results in a way I could understand. I feel very confident in her care plan.', date: new Date('2024-07-15') },
      { patientName: 'Emily R.', patientInitials: 'ER', rating: 5, comment: 'Excellent bedside manner. She really listens to her patients and creates personalized treatment plans.', date: new Date('2024-07-01') }
    ]
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'General Medicine',
    subSpecialties: ['Internal Medicine', 'Preventive Care', 'Chronic Disease Management'],
    credentials: 'MD, FACP',
    rating: 4.8,
    reviewCount: 89,
    yearsExperience: 12,
    about: 'Dr. Chen provides comprehensive primary care with a focus on preventive medicine and chronic disease management. He believes in building long-term relationships with his patients.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAttPo6-pp74FRgBBlzrBjJ4fsG1glJmf1-ft949966YXH_vvol4RHIFTuFwmLgB_Eyg5_7XxNR5_7JvCq4VeshZBbzvVdzC3_hAKjqAl1jBiVUHD6cFZLDE4qtH_q-QkD8JXzCWGhYrfd6bSPMrShM0LDT_6nTttRa9bQ9goArRwX99VPsFh012yqY0A3lBczX8MdMlPoO4YIdO5vfHf4TsTnY_WR-JcbuYeOC9fOp6ZENu1w-Uwk',
    languages: ['English', 'Mandarin'],
    education: [
      { degree: 'Residency in Internal Medicine', institution: 'Mayo Clinic' },
      { degree: 'MD', institution: 'Stanford University School of Medicine' }
    ],
    location: { type: 'Point', coordinates: [-74.0080, 40.7148], address: '200 Healthcare Ave, New York, NY', city: 'New York' },
    phone: '(555) 234-5678',
    acceptingNewPatients: true,
    telehealthAvailable: true,
    consultationFee: 120,
    availability: [
      { day: 'Monday', slots: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '17:00' }] },
      { day: 'Tuesday', slots: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '17:00' }] },
      { day: 'Wednesday', slots: [{ start: '08:00', end: '12:00' }] },
      { day: 'Thursday', slots: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '17:00' }] },
      { day: 'Friday', slots: [{ start: '08:00', end: '15:00' }] }
    ],
    reviews: [
      { patientName: 'Lisa T.', patientInitials: 'LT', rating: 5, comment: 'Dr. Chen is thorough and always makes time to answer questions. Highly recommended!', date: new Date('2024-06-20') }
    ]
  },
  {
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    subSpecialties: ['Clinical Dermatology', 'Cosmetic Dermatology', 'Skin Cancer Screening'],
    credentials: 'MD, FAAD',
    rating: 4.7,
    reviewCount: 67,
    yearsExperience: 8,
    about: 'Dr. Rodriguez is passionate about skin health and provides both medical and cosmetic dermatology services. She specializes in acne treatment, skin cancer screening, and anti-aging procedures.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUfT03Y2eOTygveJV5mZBHlvccfpVKQTgWXcZdgLVKVB69-OIEGQNEEdrUgJtGo8M0lq8m4GB4w_zGBP-7wp5MAa1gh2XzIfJuwZ6QdzEMf6pqWEm1XetORZQ3CATQRHCd15OIrGd97kDHT110JC433oOZPorYezMV3txL4MRYg6QHI_ORjvSF07m8BokOHcS2LjmSZndEfL4xGcorb_E2Bd2cKEomCWpJkJdexCMahEl8CpwGcFg',
    languages: ['English', 'Spanish'],
    education: [
      { degree: 'Residency in Dermatology', institution: 'NYU Langone Health' },
      { degree: 'MD', institution: 'Columbia University' }
    ],
    location: { type: 'Point', coordinates: [-74.0090, 40.7158], address: '300 Wellness Blvd, New York, NY', city: 'New York' },
    phone: '(555) 345-6789',
    acceptingNewPatients: true,
    telehealthAvailable: false,
    consultationFee: 175,
    availability: [
      { day: 'Monday', slots: [{ start: '09:00', end: '16:00' }] },
      { day: 'Wednesday', slots: [{ start: '09:00', end: '16:00' }] },
      { day: 'Friday', slots: [{ start: '09:00', end: '14:00' }] }
    ],
    reviews: []
  },
  {
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    subSpecialties: ['Sports Medicine', 'Joint Replacement', 'Fracture Care'],
    credentials: 'MD, FAAOS',
    rating: 4.6,
    reviewCount: 52,
    yearsExperience: 20,
    about: 'Dr. Wilson has two decades of experience in orthopedic surgery with a special focus on sports medicine and minimally invasive joint replacement.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEoh3RXZELFEkOTcEZcYxWpgtbYjIbUGyzGRmV2WIt220fxc4wMsdFHwSjSGLZkP6m1OqRrCVYtIpy4HCmkBE0GDFZ2dqHNd41Hqi4iuH1EcGqP-dTiqYDJsabEsxWqZVOFTeawQt-X-jhRXyhOqugVqISqApIBw7N610vIZXxXCKEUXb6P5_ShxPUCExWCNI6RmoqNnc06eeQ284o2OT3JoRZOIInxanoaQiTVD7ACCpFKS49_gk',
    languages: ['English'],
    education: [
      { degree: 'Fellowship in Sports Medicine', institution: 'Hospital for Special Surgery' },
      { degree: 'MD', institution: 'University of Pennsylvania' }
    ],
    location: { type: 'Point', coordinates: [-74.0050, 40.7118], address: '400 Bone & Joint Center, New York, NY', city: 'New York' },
    phone: '(555) 456-7890',
    acceptingNewPatients: true,
    telehealthAvailable: false,
    consultationFee: 200,
    availability: [
      { day: 'Tuesday', slots: [{ start: '08:00', end: '14:00' }] },
      { day: 'Thursday', slots: [{ start: '08:00', end: '14:00' }] }
    ],
    reviews: []
  },
  {
    name: 'Dr. Priya Sharma',
    specialty: 'Neurology',
    subSpecialties: ['Headache Medicine', 'Epilepsy', 'Neuromuscular Disorders'],
    credentials: 'MD, PhD',
    rating: 4.9,
    reviewCount: 98,
    yearsExperience: 14,
    about: 'Dr. Sharma combines clinical neurology with cutting-edge research. She is known for her expertise in headache medicine and complex neurological cases.',
    imageUrl: '',
    languages: ['English', 'Hindi'],
    education: [
      { degree: 'Fellowship in Headache Medicine', institution: 'Cleveland Clinic' },
      { degree: 'MD, PhD', institution: 'Johns Hopkins University' }
    ],
    location: { type: 'Point', coordinates: [-74.0040, 40.7108], address: '500 Brain Health Center, New York, NY', city: 'New York' },
    phone: '(555) 567-8901',
    acceptingNewPatients: true,
    telehealthAvailable: true,
    consultationFee: 250,
    availability: [
      { day: 'Monday', slots: [{ start: '10:00', end: '16:00' }] },
      { day: 'Wednesday', slots: [{ start: '10:00', end: '16:00' }] },
      { day: 'Friday', slots: [{ start: '10:00', end: '14:00' }] }
    ],
    reviews: []
  }
];

const pharmacies = [
  {
    name: 'HealthPlus Pharmacy',
    address: '123 Wellness Blvd, Medical District',
    location: { type: 'Point', coordinates: [-74.0070, 40.7138] },
    phone: '(555) 234-5678',
    hours: '8:00 AM - 9:00 PM',
    openTime: '08:00', closeTime: '21:00',
    is24hr: false, hasDelivery: false, rating: 4.5
  },
  {
    name: 'City Care RX',
    address: '456 Central Ave, Downtown',
    location: { type: 'Point', coordinates: [-74.0080, 40.7148] },
    phone: '(555) 345-6789',
    hours: '9:00 AM - 6:00 PM',
    openTime: '09:00', closeTime: '18:00',
    is24hr: false, hasDelivery: false, rating: 4.2
  },
  {
    name: '24/7 MedStop',
    address: '789 Night Owl Rd, Westside',
    location: { type: 'Point', coordinates: [-74.0090, 40.7158] },
    phone: '(555) 456-7890',
    hours: 'Open 24 Hours',
    openTime: '00:00', closeTime: '23:59',
    is24hr: true, hasDelivery: true, rating: 4.3
  },
  {
    name: 'Wellness Drugs',
    address: '321 Oak Street, Midtown',
    location: { type: 'Point', coordinates: [-74.0100, 40.7168] },
    phone: '(555) 567-8901',
    hours: '7:00 AM - 10:00 PM',
    openTime: '07:00', closeTime: '22:00',
    is24hr: false, hasDelivery: true, rating: 4.6
  },
  {
    name: 'QuickMeds Express',
    address: '654 Pine Avenue, East Side',
    location: { type: 'Point', coordinates: [-74.0110, 40.7178] },
    phone: '(555) 678-9012',
    hours: '8:00 AM - 8:00 PM',
    openTime: '08:00', closeTime: '20:00',
    is24hr: false, hasDelivery: true, rating: 4.1
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthsync');
    console.log('Connected to MongoDB');

    await Doctor.deleteMany({});
    await Pharmacy.deleteMany({});

    const createdDoctors = await Doctor.insertMany(doctors);
    console.log(`Seeded ${createdDoctors.length} doctors`);

    const createdPharmacies = await Pharmacy.insertMany(pharmacies);
    console.log(`Seeded ${createdPharmacies.length} pharmacies`);

    console.log('\nDoctor IDs for reference:');
    createdDoctors.forEach(d => console.log(`  ${d.name}: ${d._id}`));

    await mongoose.disconnect();
    console.log('\nSeed complete!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
