import type { Entity } from '../../lib/types';

const timestamp = new Date().toISOString();
const uploadId = 'ict-master-database-2026-02-18';

export const ICT_CODE_MODULES: Entity[] = [
  {
    id: 'code-fvg-detection',
    type: 'code_module',
    domain: 'code',
    name: 'FVG Detection Algorithm',
    description: 'Python algorithm for detecting Fair Value Gaps using smartmoneyconcepts library. Checks for bullish FVG (C1.high < C3.low) and bearish FVG (C1.low > C3.high) patterns. Returns FVG direction, top, bottom, and mitigation index.',
    content: `# Fair Value Gap Detection Algorithm
# Using smartmoneyconcepts library

from smartmoneyconcepts import smc
import pandas as pd

def detect_fvg(ohlc_data: pd.DataFrame, join_consecutive: bool = False):
    """
    Detect Fair Value Gaps in OHLC data
    
    Args:
        ohlc_data: DataFrame with columns ['open', 'high', 'low', 'close', 'volume']
        join_consecutive: If True, joins consecutive FVGs
    
    Returns:
        DataFrame with FVG data including:
        - FVG direction (1 = bullish, -1 = bearish)
        - Top (upper boundary)
        - Bottom (lower boundary)
        - MitigatedIndex (when gap was filled)
    
    Algorithm:
        For each candle i:
          Bullish FVG: candle[i-2].high < candle[i].low
            -> FVG(top=candle[i].low, bottom=candle[i-2].high)
          Bearish FVG: candle[i-2].low > candle[i].high
            -> FVG(top=candle[i-2].low, bottom=candle[i].high)
    """
    fvg_data = smc.fvg(ohlc_data, join_consecutive=join_consecutive)
    return fvg_data

# Example usage:
# df = pd.DataFrame with OHLC data
# fvgs = detect_fvg(df)
# bullish_fvgs = fvgs[fvgs['FVG'] == 1]
# bearish_fvgs = fvgs[fvgs['FVG'] == -1]`,
    metadata: {
      language: 'python',
      library: 'smartmoneyconcepts',
      functions: ['detect_fvg'],
      input: 'OHLC DataFrame',
      output: 'FVG DataFrame with direction, top, bottom, mitigation',
      algorithm: 'Three-candle pattern detection: bullish if C[i-2].high < C[i].low, bearish if C[i-2].low > C[i].high'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 650,
      lineEnd: 700,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['python', 'code', 'detector', 'fvg', 'algorithm'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'code-swing-detection',
    type: 'code_module',
    domain: 'code',
    name: 'Swing Detection + BOS/SMS Algorithm',
    description: 'Python algorithm for detecting swing highs/lows and Break of Structure (BOS) / Shift in Market Structure (SMS) using smartmoneyconcepts library. Swing High at i if high[i] > high[i-N:i] AND high[i] > high[i+1:i+N+1]. BOS: new HH breaks previous HH with displacement. SMS: price breaks below HL with displacement.',
    content: `# Swing Detection and Market Structure Analysis
# Using smartmoneyconcepts library

from smartmoneyconcepts import smc
import pandas as pd

def detect_swings(ohlc_data: pd.DataFrame, swing_length: int = 50):
    """
    Detect swing highs and lows
    
    Args:
        ohlc_data: DataFrame with OHLC data
        swing_length: Number of candles to check on each side (default: 50)
    
    Returns:
        DataFrame with HighLow (1 = swing high, -1 = swing low), Level
    
    Algorithm:
        Swing High at index i:
          high[i] > high[i-N:i] AND high[i] > high[i+1:i+N+1]
        Swing Low at index i:
          low[i] < low[i-N:i] AND low[i] < low[i+1:i+N+1]
        where N = swing_length
    """
    swings = smc.swing_highs_lows(ohlc_data, swing_length=swing_length)
    return swings

def detect_bos_choch(ohlc_data: pd.DataFrame, swing_data: pd.DataFrame, close_break: bool = True):
    """
    Detect Break of Structure (BOS) and Change of Character (CHoCH)
    
    Args:
        ohlc_data: DataFrame with OHLC data
        swing_data: DataFrame from detect_swings()
        close_break: If True, requires candle close beyond swing (default: True)
    
    Returns:
        DataFrame with:
        - BOS: Break of Structure events
        - CHOCH: Change of Character events
        - Level: Price level of the break
        - BrokenIndex: Candle index where break occurred
    
    Algorithm:
        BOS (Continuation): New HH breaks previous HH with displacement (uptrend)
                           or new LL breaks previous LL with displacement (downtrend)
        SMS/CHOCH (Reversal): Price breaks below HL with displacement (was uptrend)
                             or price breaks above LH with displacement (was downtrend)
    """
    structure = smc.bos_choch(ohlc_data, swing_data, close_break=close_break)
    return structure

# Example usage:
# df = pd.DataFrame with OHLC data
# swings = detect_swings(df, swing_length=50)
# structure = detect_bos_choch(df, swings, close_break=True)
# bos_events = structure[structure['BOS'] == 1]
# choch_events = structure[structure['CHOCH'] == 1]`,
    metadata: {
      language: 'python',
      library: 'smartmoneyconcepts',
      functions: ['detect_swings', 'detect_bos_choch'],
      input: 'OHLC DataFrame',
      output: 'Swing points and BOS/CHoCH events',
      algorithm: 'Swing detection using N-period lookback, BOS/SMS detection with displacement confirmation'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 700,
      lineEnd: 750,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['python', 'code', 'detector', 'swing', 'bos', 'sms', 'structure', 'algorithm'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
];
