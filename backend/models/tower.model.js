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
  score: { type: Number, required: true },
  fingerprints: { type: Map, of: FingerprintSchema, required: true },
  pcaps: { type: [PcapSchema], required: true },
  distance_in_meters: { type: Number }
});

const TowerSchema = new mongoose.Schema({
  kingfisher_id: { type: String, required: true },
  kingfisher_version: { type: String, required: true },
  last_modified: { type: Date, required: true },
  kingfisher_id_changed: { type: Boolean, default: false },
  rat: { type: String, required: true },
  operator_str: { type: String, required: true },
  operator_short_str: { type: String, required: true },
  mnc: { type: String, required: true },
  mcc: { type: String, required: true },
  tac: { type: String, required: true },
  freq: { type: String, required: true },
  ci: { type: String, required: true, unique: true },
  pci: { type: String, required: true },
  signal_power: { type: String, required: true },
  signal_quality: { type: String, required: true },
  analysis_report: { type: AnalysisReportSchema, required: true }
}, { timestamps: true });

const Tower = mongoose.model('Tower', TowerSchema);

export default Tower;