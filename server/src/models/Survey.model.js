import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['MCQ', 'Text'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    default: []
  }
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  isPublished: {
    type: Boolean,
    default: true
  },
  shareableLink: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

surveySchema.pre('save', async function(next) {
  if (!this.shareableLink) {
    this.shareableLink = `survey-${this._id.toString()}`;
  }
  next();
});

export const Survey = mongoose.model('Survey', surveySchema);

