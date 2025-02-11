import mongoose from 'mongoose';

const FingerprintSchema = new mongoose.Schema({
  id_: { type: String, required: true },
  type_: { type: String, required: true },
  times_triggered: { type: Number, required: true },
  certainty: { type: Number, required: true },
  description: { type: String, required: true }
});

const GnssPositionSchema = new mongoose.Schema({
  utc: { type: String },
  latitude: { type: String, required: true },
  longitude: { type: String },
  hdop: { type: String },
  altitude: { type: String }, 
  fix: { type: String, required: true },
  cog: { type: String },
  spkm: { type: String },
  spkn: { type: String },
  date: { type: String },
  nsat: { type: String }
});

const PcapSchema = new mongoose.Schema({
  path: { type: String, required: true },
  gnss_position: { type: GnssPositionSchema, required: true }
});

const AnalysisReportSchema = new mongoose.Schema({
  score: { type: Number },
  fingerprints: { type: Map, of: FingerprintSchema, required: true },
  pcaps: { type: [PcapSchema], required: true },
  distance_in_meters: { type: Number }
});

const TowerSchema = new mongoose.Schema({
  kingfisher_id: { type: String, required: true },
  kingfisher_version: { type: String, required: true },
  last_modified: { 
    type: Date,
    required: true,
    get: v => v && v.toISOString(),
    set: v => v === '' ? null : new Date(v)
  },
  kingfisher_id_changed: { type: Boolean, default: false },
  rat: { type: String, required: true, enum: ['2G', '4G', '5G'] },
  operator_str: { type: String, required: true },
  operator_short_str: { type: String, required: true },
  mnc: { type: String, required: true },
  mcc: { type: String, required: true },
  tac: { type: String }, // 4G/5G TAC
  lac: { type: String }, // 2G LAC
  freq: { type: String, required: true },
  ci: { type: String, required: true, unique: true },
  
  // Technology specific fields
  pci: { type: String }, // 4G/5G
  scs: { type: String }, // 5G only
  band: { type: String }, // 5G only
  is_gprs_support: { type: Boolean }, // 2G only
  signal_power: { type: String }, // 4G/5G
  signal_quality: { type: String }, // 4G/5G
  rx_level: { type: String }, // 2G
  
  analysis_report: { type: AnalysisReportSchema, required: true }
}, { 
  timestamps: true,
  discriminatorKey: 'rat' // Allows different schemas per RAT if needed
});

// Custom validation to ensure required fields based on RAT
TowerSchema.pre('save', function(next) {
  if (this.rat === '2G') {
    if (!this.lac) return next(new Error('LAC is required for 2G towers'));
    if (!this.rx_level) return next(new Error('RX Level is required for 2G towers'));
  }
  
  if (['4G', '5G'].includes(this.rat)) {
    if (!this.tac) return next(new Error('TAC is required for 4G/5G towers'));
    if (!this.pci) return next(new Error('PCI is required for 4G/5G towers'));
    if (!this.signal_power) return next(new Error('Signal power is required for 4G/5G towers'));
    if (!this.signal_quality) return next(new Error('Signal quality is required for 4G/5G towers'));
  }
  
  if (this.rat === '5G') {
    if (!this.scs) return next(new Error('SCS is required for 5G towers'));
    if (!this.band) return next(new Error('Band is required for 5G towers'));
  }
  
  next();
});

const Tower = mongoose.model('Tower', TowerSchema);

export default Tower;