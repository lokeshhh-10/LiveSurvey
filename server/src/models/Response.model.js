import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const responseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  answers: [answerSchema],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  userIdentifier: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

responseSchema.index({ surveyId: 1, userIdentifier: 1 });

export const Response = mongoose.model('Response', responseSchema);

