Fisher Watch - Complete Functionality Documentation

 1. Authentication System

 Login System
- User authentication via user ID and password
- Session-based authentication with 24-hour validity
- Mutual TLS authentication for enhanced security
- Automatic session expiry handling
- Session persistence across browser refreshes
- Secure HTTP-only cookies

 Logout Functionality
- Manual logout option
- Automatic session cleanup
- Event-based authentication state management
- Secure session termination

 2. Tower Monitoring Features

 Data View
- Comprehensive tower information display
- Real-time data updates every 5 seconds
- Update notifications with accept/decline options
- Visual indicators for new/updated towers
- Auto-refresh functionality

 Filtering System
- Search by CI number
- Service Provider filtering
- Network Generation filtering (2G/4G/5G)
- Tower Status filtering:
  - N/A (no score)
  - Trusted (score 0)
  - Undecided (score 1-99)
  - Rogue (score 100)
- Time-based filtering:
  - Latest update
  - 1 hour ago
  - 12 hours ago
  - 24 hours ago
  - More than 24 hours

 Tower Details View
- Basic Information:
  - Operator details
  - RAT (Radio Access Technology)
  - Creation timestamp
  - Last update time
  - Kingfisher device information
  - Device version
- Network Parameters:
  - MCC/MNC codes
  - TAC/LAC identifiers
  - CI/PCI numbers
  - Frequency data
- Signal Information:
  - Signal power measurements
  - Signal quality indicators
- Warning indicators for different Kingfisher device detections

 Analysis Reports
- Comprehensive score display
- Distance measurements
- GNSS position data:
  - Latitude/Longitude coordinates
  - Altitude measurements
  - Speed (km/h and knots)
  - Course over ground
  - Satellite information
  - HDOP values
- Fingerprint analysis:
  - Type classification
  - Trigger counts
  - Certainty levels
  - Detailed descriptions
- PCAP file information

 3. Map Visualization

 Interactive Map Features
- Dynamic tower location markers
- Color-coded tower indicators:
  - Green: Trusted towers
  - Orange: Undecided towers
  - Red: Rogue towers
- Interactive marker popups with:
  - Operator information
  - RAT details
  - Frequency data
  - Distance measurements
- Real-time location updates

 Map Controls
- Zoom functionality
- Center on selected tower
- Multiple basemap options
- Direct linking from data view
- Custom marker icons

 Map Filtering
- Service provider filters
- Technology type filters
- Score-based filtering
- Time-based filtering
- Location-based filtering

 4. Real-time Updates

 Data Synchronization
- Automatic updates every 5 seconds
- Manual update option
- Update notifications
- Change tracking
- Version control
- Conflict resolution

 Update Management
- Accept/Decline options for updates
- Visual indicators for new data
- Automatic data refresh
- Update status tracking
- Error handling

 5. User Interface

 Navigation
- Intuitive navigation bar
- Quick access to views:
  - Data view
  - Map view
- Active section highlighting
- Real-time alert display
- Logout functionality

 Visual Design
- Dark theme interface
- Responsive layout
- Mobile-friendly design
- Loading state indicators
- Error handling displays
- Success notifications
- Interactive elements
- Tooltip information
- Custom scrollbars

 Responsiveness
- Adaptive layouts
- Mobile-optimized views
- Dynamic resizing
- Touch-friendly controls
- Cross-browser compatibility

 6. Security Features

 Authentication
- Mutual TLS authentication
- Session-based security
- HTTP-only cookies
- Protected API endpoints
- Client certificate verification
- Server certificate verification
- CA-signed certificates

 Data Protection
- Encrypted connections
- Secure session management
- Access control
- Input validation
- XSS protection
- CSRF protection

 7. System Requirements

 Client Side
- Modern web browser
- Client certificates
- JavaScript enabled
- Minimum screen resolution: 768px

 Server Side
- Node.js environment
- MongoDB database
- SSL certificates
- Network connectivity
- Port accessibility

