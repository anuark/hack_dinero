const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const connectDb = async() => {
  await mongoose.connect(process.env.MONGODB_URL);
}

const RescueSchema = new Schema({
  signer: String,
  frozenContract: String,
  blockNumber: Number,
  finished: Boolean,
});

const Rescue = mongoose.model('Rescue', RescueSchema);

module.exports = { connectDb, Rescue };
