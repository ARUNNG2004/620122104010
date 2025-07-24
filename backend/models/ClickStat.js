import mongoose from 'mongoose';

const clickStatSchema = new mongoose.Schema({
  shortCode: String,


  timestamp: { type: Date, default: Date.now },
  referrer: String,
  
  location: String
});

export default mongoose.model('ClickStat', clickStatSchema);
