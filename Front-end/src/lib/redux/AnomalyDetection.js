export const DEFAULT_CONFIG = {
  cloudShadingThreshold: 65,
  rainyDayThreshold: 10,
  maxSystemCapacity: 5000,
  frozenCountLimit: 4,    
  zeroOutputDaysLimit: 3
};

export function getVal(record) {
  if (!record) return 0;
  return (
    record.generatedEnergy ??
    record.energy ??
    record.totalEnergy ??
    record.value ??
    record.output ??
    0
  );
}

export function generatedEnergy(record) {
  return getVal(record);
}

export function totalEnergy(record) {
  return getVal(record);
}

export function analyzeIntradayRecords(records, userConfig = {}) {
  const CONFIG = { ...DEFAULT_CONFIG, ...userConfig };
  if (!records || records.length === 0) return [];

  const activeRecords = records.filter(r => generatedEnergy(r) > 0);
  const totalSum = activeRecords.reduce((sum, r) => sum + generatedEnergy(r), 0);
  const dailyAverage = activeRecords.length > 0 ? totalSum / activeRecords.length : 0;

  return records.map((record) => {
    let anomalyType = null;
    let anomalyMessage = null;
    let isAnomaly = false;
    let status = "NORMAL";

    const currentVal = generatedEnergy(record);
    if (currentVal === 0) {
      return { ...record, status: "NIGHT_MODE", anomalyMessage: "System Inactive", isAnomaly: true };
    }

    if (currentVal > CONFIG.maxSystemCapacity) {
      isAnomaly = true;
      anomalyType = "SENSOR_SPIKE";
      status = "CRITICAL";
      anomalyMessage = `Abnormal High: ${currentVal}W`;
    }

    if (!isAnomaly) {
      const dropPercentage = dailyAverage > 0
        ? ((dailyAverage - currentVal) / dailyAverage) * 100
        : 0;

      if (currentVal < dailyAverage && dropPercentage > CONFIG.cloudShadingThreshold) {
        isAnomaly = true;
        anomalyType = "CLOUD_SHADING";
        status = "INFO";
        anomalyMessage = `Cloud Shading: ${dropPercentage.toFixed(1)}% drop.`;
      }
    }

    return {
      ...record,
      hasAnomaly: isAnomaly,
      status,
      anomalyType,
      anomalyMessage,
      dailyAverage: dailyAverage.toFixed(0),
      displayValue: currentVal
    };
  });
}

export function analyzeDailyPatterns(dailyRecords, userConfig = {}) {
  const CONFIG = { ...DEFAULT_CONFIG, ...userConfig };
  if (!dailyRecords || dailyRecords.length === 0) return [];

  const totalWeekEnergy = dailyRecords.reduce((sum, r) => sum + totalEnergy(r), 0);
  const weeklyAverage = totalWeekEnergy / dailyRecords.length;

  let consecutiveZeroDays = 0;

  return dailyRecords.map((dayRecord, index) => {
    let anomalyType = null;
    let anomalyMessage = null;
    let isAnomaly = false;
    let status = "NORMAL";

    const currentVal = totalEnergy(dayRecord);
    if (currentVal === 0) {
      consecutiveZeroDays++;
    } else {
      consecutiveZeroDays = 0;
    }
    if (index >= CONFIG.frozenCountLimit && currentVal > 0) {
      let isFrozen = true;
      for (let i = 1; i <= CONFIG.frozenCountLimit; i++) {
        if (!dailyRecords[index - i]) {
          isFrozen = false;
          break;
        }
        const prevVal = totalEnergy(dailyRecords[index - i]);
        if (prevVal !== currentVal) {
          isFrozen = false;
          break;
        }
      }

      if (isFrozen) {
        isAnomaly = true;
        anomalyType = "FROZEN_DAILY_DATA";
        status = "WARNING";
        anomalyMessage = `Daily generation exactly same (${currentVal}) for ${CONFIG.frozenCountLimit} days.`;
      }
    }
    if (!isAnomaly && consecutiveZeroDays >= CONFIG.zeroOutputDaysLimit) {
      isAnomaly = true;
      anomalyType = "HARDWARE_FAILURE";
      status = "CRITICAL";
      anomalyMessage = `CRITICAL: No generation for ${consecutiveZeroDays} days.`;
    }
    else if (!isAnomaly && currentVal > 0) {
      const dropPercentage = weeklyAverage > 0
        ? Math.abs((weeklyAverage - currentVal) / weeklyAverage) * 100
        : 0;
      if (currentVal < weeklyAverage && dropPercentage > CONFIG.rainyDayThreshold) {
        isAnomaly = true;
        anomalyType = "LOW_PRODUCTION_DAY";
        status = "WARNING";
        anomalyMessage = `Production ${dropPercentage.toFixed(1)}% below average.`;
      }
    }

    return {
      ...dayRecord,
      hasAnomaly: isAnomaly,
      status,
      anomalyType,
      anomalyMessage,
      weeklyAverage: weeklyAverage.toFixed(0),
      displayValue: currentVal
    };
  });
}