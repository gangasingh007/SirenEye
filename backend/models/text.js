import mongoose from 'mongoose';

const textSchema = new mongoose.Schema({
  text: { type: String, required: true },
  urgencyLevel: { type: String, required: true },
});

const textModel = mongoose.model('Text', textSchema);

export default textModel;