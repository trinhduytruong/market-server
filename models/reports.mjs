const ReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed }, // Dữ liệu có thể là bất kỳ kiểu dữ liệu nào
  });
  
  const Report = mongoose.model('Report', ReportSchema);
  