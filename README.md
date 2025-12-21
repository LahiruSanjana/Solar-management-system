# Solar Management System

## Anomaly Detection

The system includes an anomaly detection module that analyzes energy generation data to identify potential issues and environmental factors. The following types of anomalies are detected:

### 1. Sensor Spike
- **Description**: Triggered when the current energy generation exceeds the maximum system capacity.
- **Default Threshold**: > 5000W
- **Status**: CRITICAL
- **Message**: "Abnormal High: {value}W"
- **Potential Cause**: Sensor malfunction or data spike.

### 2. Cloud Shading
- **Description**: Triggered when the current energy generation drops significantly below the daily average.
- **Default Threshold**: > 65% drop from daily average
- **Status**: INFO
- **Message**: "Cloud Shading: {percentage}% drop."
- **Potential Cause**: Temporary shading caused by clouds passing over the solar panels.

### 3. Frozen Daily Data
- **Description**: Triggered when the daily energy generation remains exactly the same for multiple consecutive days.
- **Default Threshold**: 4 consecutive days with identical values
- **Status**: WARNING
- **Message**: "Daily generation exactly same ({value}) for {count} days."
- **Potential Cause**: Data logging issue, sensor freeze, or communication failure.

### 4. Hardware Failure
- **Description**: Triggered when there is no energy generation (0 output) for multiple consecutive days.
- **Default Threshold**: 3 consecutive days with 0 output
- **Status**: CRITICAL
- **Message**: "CRITICAL: No generation for {count} days."
- **Potential Cause**: Inverter failure, disconnection, or severe hardware damage.

### 5. Low Production Day
- **Description**: Triggered when the daily production is significantly lower than the weekly average.
- **Default Threshold**: > 10% drop from weekly average
- **Status**: WARNING
- **Message**: "Production {percentage}% below average."
- **Potential Cause**: Rainy weather, heavy overcast, or dirty panels.

### 6. Night Mode
- **Description**: Triggered when the current energy generation is 0.
- **Status**: NIGHT_MODE
- **Message**: "System Inactive"
- **Potential Cause**: Normal operation during nighttime.