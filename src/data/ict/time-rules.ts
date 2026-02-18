// Time rules from concept_relationships.yaml

export const ICT_TIME_RULES = {
  killzones: {
    asian: {
      time: '19:00-00:00 ET',
      behavior: 'Accumulation, range-bound',
      trade_style: 'Generally avoid, or fade extremes',
      liquidity_builds: ['asian_high', 'asian_low']
    },
    london: {
      time: '02:00-05:00 ET',
      behavior: 'First real move of the day',
      trade_style: 'Look for sweep of Asian range',
      best_setups: ['judas_swing', 'ict_2022']
    },
    ny_am: {
      time: '08:30-11:00 ET',
      behavior: 'Highest volume, biggest moves',
      trade_style: 'Primary trading session',
      best_setups: ['silver_bullet', 'turtle_soup'],
      contains: ['10am_silver_bullet']
    },
    ny_pm: {
      time: '13:30-16:00 ET',
      behavior: 'Second push, often reversal of AM',
      trade_style: 'Continuation or reversal',
      best_setups: ['silver_bullet', 'pm_session_reversal'],
      contains: ['3pm_silver_bullet']
    }
  },
  
  macros: [
    { name: '09:50-10:10 Macro', action: 'Look for spooling or reversal' },
    { name: '10:50-11:10 Macro', action: 'Silver Bullet cleanup / reversal' },
    { name: '11:50-12:10 Macro', action: 'Lunch time injection' },
    { name: '13:10-13:40 Macro', action: 'PM Session injection' }
  ],
  
  macro_times: {
    description: 'ICT macro times — micro session opens',
    times: [
      '09:30 ET', // NYSE open
      '09:50 ET',
      '10:10 ET',
      '10:50 ET',
      '11:10 ET',
      '13:10 ET',
      '13:50 ET',
      '14:10 ET',
      '14:50 ET',
      '15:10 ET',
      '15:50 ET'
    ],
    usage: 'Look for displacement/FVG at these exact times'
  },
  
  opening_prices: [
    'Midnight NY Opening Price',
    '8:30am NY Opening Price'
  ],
  
  silver_bullet_windows: [
    { time: '03:00-04:00 ET', session: 'London' },
    { time: '10:00-11:00 ET', session: 'NY AM' },
    { time: '14:00-15:00 ET', session: 'NY PM' }
  ],
  
  avoid_times: [
    { 
      time: '12:00-13:00 ET',
      reason: 'Noon Lunch Hour — Low probability / Chop'
    },
    { 
      time: '12:00-13:30 ET',
      reason: 'NY lunch — choppy, no direction'
    },
    { 
      time: '16:30-18:00 ET',
      reason: 'Market Close / Spreads widen'
    },
    { 
      time: '17:00 ET',
      reason: 'Market close — spreads widen'
    },
    { 
      time: 'major_news',
      reason: '30 min before/after high impact news'
    },
    { 
      time: 'sunday_open',
      reason: 'Gaps and low liquidity'
    },
    { 
      time: 'friday_afternoon',
      reason: 'Position squaring, unpredictable'
    }
  ]
};

// Helper function to check if current time is in a killzone
export function isInKillzone(currentTime: Date, timezone: string = 'America/New_York'): string | null {
  const hour = currentTime.getHours();
  
  // Asian: 19:00-00:00 (7 PM - midnight)
  if (hour >= 19 || hour < 0) {
    return 'asian';
  }
  
  // London: 02:00-05:00 (2 AM - 5 AM)
  if (hour >= 2 && hour < 5) {
    return 'london';
  }
  
  // NY AM: 08:30-11:00 (8:30 AM - 11 AM)
  if (hour >= 8 && hour < 11) {
    return 'ny_am';
  }
  
  // NY PM: 13:30-16:00 (1:30 PM - 4 PM)
  if (hour >= 13 && hour < 16) {
    return 'ny_pm';
  }
  
  return null;
}

// Helper function to check if time should be avoided
export function shouldAvoidTime(currentTime: Date): { avoid: boolean; reason?: string } {
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  
  // Lunch hour: 12:00-13:30
  if (hour === 12 || (hour === 13 && minute < 30)) {
    return { avoid: true, reason: 'NY lunch — choppy, no direction' };
  }
  
  // Market close: 16:30-18:00
  if (hour >= 16 && (hour < 18 || (hour === 16 && minute >= 30))) {
    return { avoid: true, reason: 'Market Close / Spreads widen' };
  }
  
  // Sunday open (day of week 0)
  if (currentTime.getDay() === 0) {
    return { avoid: true, reason: 'Sunday open — Gaps and low liquidity' };
  }
  
  // Friday afternoon (day of week 5, after 3 PM)
  if (currentTime.getDay() === 5 && hour >= 15) {
    return { avoid: true, reason: 'Friday afternoon — Position squaring' };
  }
  
  return { avoid: false };
}

// Helper function to check if in Silver Bullet window
export function isInSilverBulletWindow(currentTime: Date): boolean {
  const hour = currentTime.getHours();
  
  // London: 03:00-04:00
  if (hour >= 3 && hour < 4) {
    return true;
  }
  
  // NY AM: 10:00-11:00
  if (hour >= 10 && hour < 11) {
    return true;
  }
  
  // NY PM: 14:00-15:00
  if (hour >= 14 && hour < 15) {
    return true;
  }
  
  return false;
}
