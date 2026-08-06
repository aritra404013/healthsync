import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gsspgamer_db_user:7SINPy3Zh558sijm@cluster0.dleac5a.mongodb.net/healthsync?retryWrites=true&w=majority';

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  const Doctor = mongoose.model('Doctor', new mongoose.Schema({}, { strict: false }));
  const docs = await Doctor.find({});
  console.log('Found doctors count:', docs.length);
  if (docs.length > 0) {
    console.log('Sample doctor:', JSON.stringify(docs[0], null, 2));
  }

  const Appointment = mongoose.model('Appointment', new mongoose.Schema({}, { strict: false }));
  const appts = await Appointment.find({});
  console.log('Found appointments count:', appts.length);

  await mongoose.disconnect();
}

main().catch(console.error);
