import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const DB_FILE = path.resolve(os.tmpdir(), 'healthsync_db.json');

// Initial production-grade medical database seed
const initialSeed = {
  doctors: [
    {
      _id: 'doc_in_1',
      id: 'doc_in_1',
      name: 'Dr. Rajesh Sharma',
      specialty: 'Cardiology',
      credentials: 'MBBS, MD, DM (Cardiology)',
      hospital: 'Apollo Medical Center & Heart Institute',
      clinicName: 'Apollo Heart Clinic & Diagnostic Center',
      fee: '₹800 ($10)',
      rating: 4.9,
      reviewCount: 342,
      yearsExperience: 18,
      languages: ['English', 'Hindi', 'Marathi'],
      acceptingNewPatients: true,
      telehealthAvailable: true,
      phone: '+91 98200 44821',
      address: 'Plot No. 13, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
      city: 'Mumbai',
      imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
      about: 'Dr. Rajesh Sharma is a Senior Interventional Cardiologist with over 18 years of clinical experience in coronary care, preventative cardiology, and hypertension management.',
      subSpecialties: ['Interventional Cardiology', 'Hypertension & Heart Failure', 'Coronary Angiography'],
      education: [{ degree: 'DM (Cardiology)', institution: 'AIIMS New Delhi' }, { degree: 'MD (Internal Medicine)', institution: 'KEM Hospital Mumbai' }],
      reviews: [{ patientInitials: 'A.K.', rating: 5, comment: 'Dr. Sharma explained everything patiently. Highly professional clinic!', date: new Date().toISOString() }],
      location: { type: 'Point', coordinates: [72.868, 19.066] },
      timeSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '05:00 PM', '06:30 PM']
    },
    {
      _id: 'doc_in_2',
      id: 'doc_in_2',
      name: 'Dr. Ananya Mukherjee',
      specialty: 'General Practice',
      credentials: 'MBBS, MD (Internal Medicine)',
      hospital: 'Fortis Health Clinic',
      clinicName: 'Fortis Multispecialty Clinic & Care Center',
      fee: '₹500 ($6)',
      rating: 4.9,
      reviewCount: 289,
      yearsExperience: 14,
      languages: ['English', 'Hindi', 'Bengali'],
      acceptingNewPatients: true,
      telehealthAvailable: true,
      phone: '+91 98311 09842',
      address: '73 Park Street, Park Street Area, Kolkata, West Bengal 700016',
      city: 'Kolkata',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
      about: 'Dr. Ananya Mukherjee is a renowned Physician specializing in general medicine, fever management, diabetes care, and lifestyle disease prevention.',
      subSpecialties: ['Internal Diagnostics', 'Fever & Infection Care', 'Diabetology'],
      education: [{ degree: 'MD (Internal Medicine)', institution: 'Calcutta Medical College' }],
      reviews: [{ patientInitials: 'S.R.', rating: 5, comment: 'Extremely compassionate doctor. Excellent consultation experience.', date: new Date().toISOString() }],
      location: { type: 'Point', coordinates: [88.353, 22.553] },
      timeSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:30 PM', '07:00 PM']
    },
    {
      _id: 'doc_in_3',
      id: 'doc_in_3',
      name: 'Dr. Vikram Malhotra',
      specialty: 'Neurology',
      credentials: 'MBBS, MS, DNB (Neurology)',
      hospital: 'Max Super Specialty Hospital Clinic',
      clinicName: 'Max Brain & Spine Clinic',
      fee: '₹1,000 ($12)',
      rating: 4.8,
      reviewCount: 195,
      yearsExperience: 16,
      languages: ['English', 'Hindi', 'Punjabi'],
      acceptingNewPatients: true,
      telehealthAvailable: true,
      phone: '+91 98112 55901',
      address: '1, Press Enclave Road, Saket, New Delhi, Delhi 110017',
      city: 'New Delhi',
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
      about: 'Dr. Vikram Malhotra is a Senior Neurologist specializing in severe headache management, stroke prevention, epilepsy, and spinal disorders.',
      subSpecialties: ['Migraine & Headache Disorders', 'Stroke Care', 'Neuro-Diagnostics'],
      education: [{ degree: 'DNB Neurology', institution: 'MAMC New Delhi' }],
      reviews: [{ patientInitials: 'P.V.', rating: 5, comment: 'Dr. Malhotra correctly diagnosed my migraine after years of suffering.', date: new Date().toISOString() }],
      location: { type: 'Point', coordinates: [77.21, 28.528] },
      timeSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM', '06:00 PM']
    },
    {
      _id: 'doc_in_4',
      id: 'doc_in_4',
      name: 'Dr. Priya Nair',
      specialty: 'Pediatrics',
      credentials: 'MBBS, DCH, MD (Pediatrics)',
      hospital: 'Manipal Healthcare Clinic',
      clinicName: 'Little Angels Child Care & Clinic',
      fee: '₹600 ($7)',
      rating: 4.9,
      reviewCount: 412,
      yearsExperience: 12,
      languages: ['English', 'Hindi', 'Kannada', 'Malayalam'],
      acceptingNewPatients: true,
      telehealthAvailable: true,
      phone: '+91 98450 12890',
      address: '98 HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
      city: 'Bangalore',
      imageUrl: 'https://images.unsplash.com/photo-1594824813566-78a933758f46?w=400&auto=format&fit=crop&q=80',
      about: 'Dr. Priya Nair is a dedicated Pediatrician providing comprehensive child healthcare, growth monitoring, and pediatric immunization.',
      subSpecialties: ['Pediatric Infections', 'Child Growth & Nutrition', 'Vaccinations'],
      education: [{ degree: 'MD Pediatrics', institution: 'Bangalore Medical College' }],
      reviews: [{ patientInitials: 'M.N.', rating: 5, comment: 'Wonderful with kids! Very gentle and thorough.', date: new Date().toISOString() }],
      location: { type: 'Point', coordinates: [77.641, 12.978] },
      timeSlots: ['10:30 AM', '12:00 PM', '03:30 PM', '05:30 PM']
    },
    {
      _id: 'doc_1',
      id: 'doc_1',
      name: 'Dr. Sarah Jenkins',
      specialty: 'General Practice',
      credentials: 'MD, FACP',
      hospital: 'Park Avenue Health Clinic',
      clinicName: 'Park Avenue Internal Medicine & Clinic',
      fee: '$150',
      rating: 4.9,
      reviewCount: 128,
      yearsExperience: 14,
      languages: ['English', 'Spanish'],
      acceptingNewPatients: true,
      telehealthAvailable: true,
      phone: '(212) 555-0182',
      address: '742 Park Avenue, Suite 400, New York, NY 10021',
      city: 'New York',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
      about: 'Dr. Sarah Jenkins is a board-certified General Practitioner with over 14 years of clinical experience in preventative care and internal medicine.',
      subSpecialties: ['Preventative Medicine', 'Chronic Illness', 'Wellness'],
      education: [{ degree: 'Doctor of Medicine (MD)', institution: 'Harvard Medical School' }],
      reviews: [{ patientInitials: 'R.M.', rating: 5, comment: 'Dr. Jenkins listened attentively and provided exceptional care.', date: new Date().toISOString() }],
      location: { type: 'Point', coordinates: [-73.963, 40.771] },
      timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
    }
  ],
  pharmacies: [
    { _id: 'pharm_1', name: 'CVS Pharmacy #4829', address: '500 Lexington Ave, New York, NY 10017', phone: '(212) 555-0192', distance: '0.3', is24hr: true, hours: 'Open 24 Hours', hasDelivery: true, lat: 40.756, lng: -73.974 },
    { _id: 'pharm_2', name: 'Walgreens Pharmacy', address: '148 E 86th St, New York, NY 10028', phone: '(212) 555-0348', distance: '0.6', is24hr: false, hours: 'Open until 10:00 PM', hasDelivery: true, lat: 40.779, lng: -73.955 },
    { _id: 'pharm_3', name: 'Duane Reade Pharmacy', address: '1251 Avenue of the Americas, New York, NY 10020', phone: '(212) 555-0982', distance: '0.8', is24hr: true, hours: 'Open 24 Hours', hasDelivery: false, lat: 40.759, lng: -73.982 },
    { _id: 'pharm_4', name: 'Metro Health Pharmacy', address: '920 2nd Ave, New York, NY 10017', phone: '(212) 555-0411', distance: '1.2', is24hr: false, hours: 'Open until 9:00 PM', hasDelivery: true, lat: 40.751, lng: -73.971 }
  ],
  appointments: [
    {
      _id: 'app_1',
      doctorId: { _id: 'doc_1', name: 'Dr. Sarah Jenkins', specialty: 'General Practice', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80', location: { address: '742 Park Avenue, Suite 400, New York, NY 10021' } },
      date: new Date(Date.now() + 86400000).toISOString(),
      time: '10:30 AM',
      type: 'in-person',
      reason: 'Routine Health Consultation',
      status: 'confirmed'
    }
  ],
  prescriptions: [
    {
      _id: 'rx_1',
      medication: 'Amoxicillin 500mg',
      dosage: '1 capsule 3x daily',
      frequency: 'Three times daily with meals',
      duration: '7 days',
      doctorId: { name: 'Dr. Sarah Jenkins' },
      refillsRemaining: 1,
      status: 'active',
      instructions: 'Take with food and complete full 7 day course.'
    }
  ],
  chatSessions: []
};

class LocalDatabase {
  constructor() {
    this.ensureDir();
    this.data = this.readData();
  }

  ensureDir() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  readData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Initializing new local database...');
    }
    this.writeData(initialSeed);
    return initialSeed;
  }

  writeData(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      this.data = data;
    } catch (e) {
      console.error('Failed to write local database file:', e);
    }
  }

  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
      this.writeData(this.data);
    }
    return this.data[name];
  }

  find(collectionName, query = {}) {
    const coll = this.getCollection(collectionName);
    return coll.filter(item => {
      for (const key in query) {
        if (query[key] instanceof RegExp) {
          if (!query[key].test(item[key])) return false;
        } else if (typeof query[key] === 'string' && typeof item[key] === 'string') {
          if (!item[key].toLowerCase().includes(query[key].toLowerCase())) return false;
        } else if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  findById(collectionName, id) {
    const coll = this.getCollection(collectionName);
    return coll.find(item => item._id === id || item.id === id);
  }

  insert(collectionName, doc) {
    const coll = this.getCollection(collectionName);
    const newDoc = {
      _id: doc._id || `${collectionName.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...doc
    };
    coll.unshift(newDoc);
    this.writeData(this.data);
    return newDoc;
  }

  update(collectionName, id, updateFields) {
    const coll = this.getCollection(collectionName);
    const index = coll.findIndex(item => item._id === id || item.id === id);
    if (index !== -1) {
      coll[index] = { ...coll[index], ...updateFields, updatedAt: new Date().toISOString() };
      this.writeData(this.data);
      return coll[index];
    }
    return null;
  }

  delete(collectionName, id) {
    const coll = this.getCollection(collectionName);
    const index = coll.findIndex(item => item._id === id || item.id === id);
    if (index !== -1) {
      const removed = coll.splice(index, 1);
      this.writeData(this.data);
      return removed[0];
    }
    return null;
  }
}

export const localDb = new LocalDatabase();
export default localDb;
