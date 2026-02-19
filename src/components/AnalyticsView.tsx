import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis } from 'recharts';
import { TrendUp, TrendDown, Target, Clock, CheckCircle, XCircle, ChartBar, Lightning, Calendar, Coins } from '@phosphor-icons/react';
import type { Entity } from '@/lib/types';

interface AnalyticsViewProps {
  entities: Entity[];
}

interface TradeMetrics {
  totalTrades: number;
  winners: number;
  losers: number;
  winRate: number;
  totalPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  avgRR: number;
  bestTrade: number;
  worstTrade: number;
  avgDuration: number;
  totalPips: number;
}

const COLORS = {
  win: 'oklch(0.75 0.2 145)',
  loss: 'oklch(0.6 0.24 25)',
  primary: 'oklch(0.75 0.2 145)',
  accent: 'oklch(0.7 0.15 195)',
  muted: 'oklch(0.35 0.01 264)',
  chart1: 'oklch(0.75 0.2 145)',
  chart2: 'oklch(0.7 0.15 195)',
  chart3: 'oklch(0.6 0.18 265)',
  chart4: 'oklch(0.65 0.2 310)',
  chart5: 'oklch(0.7 0.15 75)',
};

export function AnalyticsView({ entities }: AnalyticsViewProps) {
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '30d' | '90d'>('all');
  const [pairFilter, setPairFilter] = useState<string>('all');
  const [setupFilter, setSetupFilter] = useState<string>('all');

  const trades = useMemo(() => {
    return entities.filter(e => e.type === 'trade' && e.metadata?.execution);
  }, [entities]);

  const filteredTrades = useMemo(() => {
    let filtered = [...trades];

    if (timeFilter !== 'all') {
      const days = parseInt(timeFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(t => new Date(t.createdAt) >= cutoffDate);
    }

    if (pairFilter !== 'all') {
      filtered = filtered.filter(t => t.metadata?.market?.pair === pairFilter);
    }

    if (setupFilter !== 'all') {
      filtered = filtered.filter(t => t.metadata?.setup?.setup_type === setupFilter);
    }

    return filtered;
  }, [trades, timeFilter, pairFilter, setupFilter]);

  const pairs = useMemo(() => {
    const pairSet = new Set(trades.map(t => t.metadata?.market?.pair).filter(Boolean));
    return Array.from(pairSet);
  }, [trades]);

  const setupTypes = useMemo(() => {
    const setupSet = new Set(trades.map(t => t.metadata?.setup?.setup_type).filter(Boolean));
    return Array.from(setupSet);
  }, [trades]);

  const metrics = useMemo((): TradeMetrics => {
    const winners = filteredTrades.filter(t => t.metadata?.execution?.result === 'WIN');
    const losers = filteredTrades.filter(t => t.metadata?.execution?.result === 'LOSS');

    const totalPnL = filteredTrades.reduce((sum, t) => sum + (t.metadata?.execution?.pnl || 0), 0);
    const totalWinPnL = winners.reduce((sum, t) => sum + (t.metadata?.execution?.pnl || 0), 0);
    const totalLossPnL = Math.abs(losers.reduce((sum, t) => sum + (t.metadata?.execution?.pnl || 0), 0));

    const totalPips = filteredTrades.reduce((sum, t) => sum + (t.metadata?.execution?.pips || 0), 0);
    const avgDuration = filteredTrades.reduce((sum, t) => sum + (t.metadata?.execution?.duration_seconds || 0), 0) / (filteredTrades.length || 1);

    const allPnLs = filteredTrades.map(t => t.metadata?.execution?.pnl || 0);

    return {
      totalTrades: filteredTrades.length,
      winners: winners.length,
      losers: losers.length,
      winRate: filteredTrades.length > 0 ? (winners.length / filteredTrades.length) * 100 : 0,
      totalPnL,
      avgWin: winners.length > 0 ? totalWinPnL / winners.length : 0,
      avgLoss: losers.length > 0 ? totalLossPnL / losers.length : 0,
      profitFactor: totalLossPnL > 0 ? totalWinPnL / totalLossPnL : totalWinPnL > 0 ? 999 : 0,
      avgRR: filteredTrades.reduce((sum, t) => sum + (t.metadata?.execution?.risk_reward_ratio || 0), 0) / (filteredTrades.length || 1),
      bestTrade: allPnLs.length > 0 ? Math.max(...allPnLs) : 0,
      worstTrade: allPnLs.length > 0 ? Math.min(...allPnLs) : 0,
      avgDuration,
      totalPips
    };
  }, [filteredTrades]);

  const winRateData = useMemo(() => [
    { name: 'Wins', value: metrics.winners, color: COLORS.win },
    { name: 'Losses', value: metrics.losers, color: COLORS.loss }
  ], [metrics]);

  const pnlByDate = useMemo(() => {
    const dateMap = new Map<string, { date: string; pnl: number; cumulative: number; trades: number }>();
    
    const sorted = [...filteredTrades].sort((a, b) => 
      new Date(a.metadata?.context?.date || a.createdAt).getTime() - 
      new Date(b.metadata?.context?.date || b.createdAt).getTime()
    );

    let cumulative = 0;
    sorted.forEach(trade => {
      const date = trade.metadata?.context?.date || trade.createdAt.split('T')[0];
      const pnl = trade.metadata?.execution?.pnl || 0;
      cumulative += pnl;

      if (dateMap.has(date)) {
        const existing = dateMap.get(date)!;
        existing.pnl += pnl;
        existing.cumulative = cumulative;
        existing.trades += 1;
      } else {
        dateMap.set(date, { date, pnl, cumulative, trades: 1 });
      }
    });

    return Array.from(dateMap.values());
  }, [filteredTrades]);

  const pairPerformance = useMemo(() => {
    const pairMap = new Map<string, { pair: string; wins: number; losses: number; pnl: number; trades: number }>();

    filteredTrades.forEach(trade => {
      const pair = trade.metadata?.market?.pair || 'Unknown';
      const result = trade.metadata?.execution?.result;
      const pnl = trade.metadata?.execution?.pnl || 0;

      if (pairMap.has(pair)) {
        const existing = pairMap.get(pair)!;
        existing.trades += 1;
        existing.pnl += pnl;
        if (result === 'WIN') existing.wins += 1;
        if (result === 'LOSS') existing.losses += 1;
      } else {
        pairMap.set(pair, {
          pair,
          wins: result === 'WIN' ? 1 : 0,
          losses: result === 'LOSS' ? 1 : 0,
          pnl,
          trades: 1
        });
      }
    });

    return Array.from(pairMap.values()).map(p => ({
      ...p,
      winRate: p.trades > 0 ? (p.wins / p.trades) * 100 : 0
    }));
  }, [filteredTrades]);

  const setupPerformance = useMemo(() => {
    const setupMap = new Map<string, { setup: string; wins: number; losses: number; pnl: number; trades: number }>();

    filteredTrades.forEach(trade => {
      const setup = trade.metadata?.setup?.setup_type || 'Unknown';
      const result = trade.metadata?.execution?.result;
      const pnl = trade.metadata?.execution?.pnl || 0;

      if (setupMap.has(setup)) {
        const existing = setupMap.get(setup)!;
        existing.trades += 1;
        existing.pnl += pnl;
        if (result === 'WIN') existing.wins += 1;
        if (result === 'LOSS') existing.losses += 1;
      } else {
        setupMap.set(setup, {
          setup,
          wins: result === 'WIN' ? 1 : 0,
          losses: result === 'LOSS' ? 1 : 0,
          pnl,
          trades: 1
        });
      }
    });

    return Array.from(setupMap.values()).map(s => ({
      ...s,
      winRate: s.trades > 0 ? (s.wins / s.trades) * 100 : 0
    }));
  }, [filteredTrades]);

  const sessionPerformance = useMemo(() => {
    const sessionMap = new Map<string, { session: string; wins: number; losses: number; pnl: number; trades: number }>();

    filteredTrades.forEach(trade => {
      const session = trade.metadata?.context?.killzone || 'Unknown';
      const result = trade.metadata?.execution?.result;
      const pnl = trade.metadata?.execution?.pnl || 0;

      if (sessionMap.has(session)) {
        const existing = sessionMap.get(session)!;
        existing.trades += 1;
        existing.pnl += pnl;
        if (result === 'WIN') existing.wins += 1;
        if (result === 'LOSS') existing.losses += 1;
      } else {
        sessionMap.set(session, {
          session,
          wins: result === 'WIN' ? 1 : 0,
          losses: result === 'LOSS' ? 1 : 0,
          pnl,
          trades: 1
        });
      }
    });

    return Array.from(sessionMap.values()).map(s => ({
      ...s,
      winRate: s.trades > 0 ? (s.wins / s.trades) * 100 : 0
    }));
  }, [filteredTrades]);

  const gradeDistribution = useMemo(() => {
    const gradeMap = new Map<string, number>();

    filteredTrades.forEach(trade => {
      const grade = trade.metadata?.meta?.grade || 'Unknown';
      gradeMap.set(grade, (gradeMap.get(grade) || 0) + 1);
    });

    return Array.from(gradeMap.entries()).map(([grade, count]) => ({
      grade,
      count
    }));
  }, [filteredTrades]);

  const rrDistribution = useMemo(() => {
    const buckets = ['<1R', '1-2R', '2-3R', '3-4R', '>4R'];
    const distribution = buckets.map(bucket => ({ bucket, count: 0 }));

    filteredTrades.forEach(trade => {
      const rr = trade.metadata?.execution?.risk_reward_ratio || 0;
      if (rr < 1) distribution[0].count++;
      else if (rr < 2) distribution[1].count++;
      else if (rr < 3) distribution[2].count++;
      else if (rr < 4) distribution[3].count++;
      else distribution[4].count++;
    });

    return distribution;
  }, [filteredTrades]);

  const confluenceAnalysis = useMemo(() => {
    const confluenceMap = new Map<number, { count: number; wins: number; avgPnL: number; totalPnL: number }>();

    filteredTrades.forEach(trade => {
      const confluenceCount = trade.metadata?.context?.confluence_count || 0;
      const result = trade.metadata?.execution?.result;
      const pnl = trade.metadata?.execution?.pnl || 0;

      if (confluenceMap.has(confluenceCount)) {
        const existing = confluenceMap.get(confluenceCount)!;
        existing.count += 1;
        existing.totalPnL += pnl;
        if (result === 'WIN') existing.wins += 1;
      } else {
        confluenceMap.set(confluenceCount, {
          count: 1,
          wins: result === 'WIN' ? 1 : 0,
          totalPnL: pnl,
          avgPnL: pnl
        });
      }
    });

    return Array.from(confluenceMap.entries())
      .map(([confluences, data]) => ({
        confluences: `${confluences} factors`,
        winRate: data.count > 0 ? (data.wins / data.count) * 100 : 0,
        avgPnL: data.totalPnL / data.count,
        trades: data.count
      }))
      .sort((a, b) => parseInt(a.confluences) - parseInt(b.confluences));
  }, [filteredTrades]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Performance Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive trade performance metrics and insights</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as any)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={pairFilter} onValueChange={setPairFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Currency Pair" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pairs</SelectItem>
              {pairs.map(pair => (
                <SelectItem key={pair} value={pair}>{pair}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={setupFilter} onValueChange={setSetupFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Setup Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Setups</SelectItem>
              {setupTypes.map(setup => (
                <SelectItem key={setup} value={setup}>
                  {setup.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ChartBar size={16} />
              Total Trades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalTrades}</div>
            <div className="text-xs text-muted-foreground mt-1 flex gap-2">
              <span className="text-[oklch(0.75_0.2_145)]">{metrics.winners}W</span>
              <span className="text-[oklch(0.6_0.24_25)]">{metrics.losers}L</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Target size={16} />
              Win Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.winRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {metrics.winners} / {metrics.totalTrades} trades
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Coins size={16} />
              Total P&L
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${metrics.totalPnL >= 0 ? 'text-[oklch(0.75_0.2_145)]' : 'text-[oklch(0.6_0.24_25)]'}`}>
              ${metrics.totalPnL.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {metrics.totalPips.toFixed(1)} pips
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Lightning size={16} />
              Profit Factor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metrics.profitFactor === 999 ? '∞' : metrics.profitFactor.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Avg R:R {metrics.avgRR.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pairs">By Pair</TabsTrigger>
          <TabsTrigger value="setups">By Setup</TabsTrigger>
          <TabsTrigger value="sessions">By Session</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cumulative P&L</CardTitle>
                <CardDescription>Equity curve over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={pnlByDate}>
                    <defs>
                      <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                    <XAxis dataKey="date" stroke="oklch(0.65 0.01 264)" fontSize={12} />
                    <YAxis stroke="oklch(0.65 0.01 264)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.2 0.01 264)',
                        border: '1px solid oklch(0.35 0.01 264)',
                        borderRadius: '8px',
                        color: 'oklch(0.9 0 0)'
                      }}
                    />
                    <Area type="monotone" dataKey="cumulative" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorPnL)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Win/Loss Distribution</CardTitle>
                <CardDescription>Outcome breakdown</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={winRateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {winRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily P&L</CardTitle>
                <CardDescription>Profit/loss by trading day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pnlByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                    <XAxis dataKey="date" stroke="oklch(0.65 0.01 264)" fontSize={12} />
                    <YAxis stroke="oklch(0.65 0.01 264)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.2 0.01 264)',
                        border: '1px solid oklch(0.35 0.01 264)',
                        borderRadius: '8px',
                        color: 'oklch(0.9 0 0)'
                      }}
                    />
                    <Bar dataKey="pnl" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk/Reward Distribution</CardTitle>
                <CardDescription>R:R ratio breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rrDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                    <XAxis dataKey="bucket" stroke="oklch(0.65 0.01 264)" fontSize={12} />
                    <YAxis stroke="oklch(0.65 0.01 264)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.2 0.01 264)',
                        border: '1px solid oklch(0.35 0.01 264)',
                        borderRadius: '8px',
                        color: 'oklch(0.9 0 0)'
                      }}
                    />
                    <Bar dataKey="count" fill={COLORS.accent} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pairs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Currency Pair</CardTitle>
              <CardDescription>Win rate and P&L by pair</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={pairPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                  <XAxis dataKey="pair" stroke="oklch(0.65 0.01 264)" />
                  <YAxis yAxisId="left" stroke="oklch(0.65 0.01 264)" />
                  <YAxis yAxisId="right" orientation="right" stroke="oklch(0.65 0.01 264)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.2 0.01 264)',
                      border: '1px solid oklch(0.35 0.01 264)',
                      borderRadius: '8px',
                      color: 'oklch(0.9 0 0)'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="pnl" fill={COLORS.primary} name="P&L ($)" />
                  <Bar yAxisId="right" dataKey="winRate" fill={COLORS.accent} name="Win Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pairPerformance.map(pair => (
              <Card key={pair.pair}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{pair.pair}</CardTitle>
                  <CardDescription>{pair.trades} trades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Win Rate:</span>
                      <Badge variant={pair.winRate >= 50 ? 'default' : 'secondary'}>
                        {pair.winRate.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">P&L:</span>
                      <span className={`font-semibold ${pair.pnl >= 0 ? 'text-[oklch(0.75_0.2_145)]' : 'text-[oklch(0.6_0.24_25)]'}`}>
                        ${pair.pnl.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Record:</span>
                      <span className="text-sm">
                        <span className="text-[oklch(0.75_0.2_145)]">{pair.wins}</span>
                        {' / '}
                        <span className="text-[oklch(0.6_0.24_25)]">{pair.losses}</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="setups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Setup Type</CardTitle>
              <CardDescription>Comparing different ICT models</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={setupPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                  <XAxis type="number" stroke="oklch(0.65 0.01 264)" />
                  <YAxis dataKey="setup" type="category" stroke="oklch(0.65 0.01 264)" width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.2 0.01 264)',
                      border: '1px solid oklch(0.35 0.01 264)',
                      borderRadius: '8px',
                      color: 'oklch(0.9 0 0)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="wins" stackId="a" fill={COLORS.win} name="Wins" />
                  <Bar dataKey="losses" stackId="a" fill={COLORS.loss} name="Losses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {setupPerformance.map(setup => (
              <Card key={setup.setup}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {setup.setup.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </CardTitle>
                  <CardDescription>{setup.trades} trades executed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Win Rate:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${setup.winRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-12">{setup.winRate.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total P&L:</span>
                      <span className={`font-semibold ${setup.pnl >= 0 ? 'text-[oklch(0.75_0.2_145)]' : 'text-[oklch(0.6_0.24_25)]'}`}>
                        ${setup.pnl.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Killzone/Session</CardTitle>
              <CardDescription>ICT time-based analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={sessionPerformance}>
                  <PolarGrid stroke={COLORS.muted} />
                  <PolarAngleAxis dataKey="session" stroke="oklch(0.9 0 0)" />
                  <PolarRadiusAxis stroke="oklch(0.65 0.01 264)" />
                  <Radar name="Win Rate (%)" dataKey="winRate" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.2 0.01 264)',
                      border: '1px solid oklch(0.35 0.01 264)',
                      borderRadius: '8px',
                      color: 'oklch(0.9 0 0)'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionPerformance.map(session => (
              <Card key={session.session}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock size={18} />
                    {session.session.replace(/_/g, ' ')}
                  </CardTitle>
                  <CardDescription>{session.trades} trades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Win Rate:</span>
                      <Badge variant={session.winRate >= 50 ? 'default' : 'secondary'}>
                        {session.winRate.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">P&L:</span>
                      <span className={`font-semibold ${session.pnl >= 0 ? 'text-[oklch(0.75_0.2_145)]' : 'text-[oklch(0.6_0.24_25)]'}`}>
                        ${session.pnl.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Record:</span>
                      <span className="text-sm">
                        {session.wins}W / {session.losses}L
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Setup Grade Distribution</CardTitle>
                <CardDescription>Quality assessment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                    <XAxis dataKey="grade" stroke="oklch(0.65 0.01 264)" />
                    <YAxis stroke="oklch(0.65 0.01 264)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.2 0.01 264)',
                        border: '1px solid oklch(0.35 0.01 264)',
                        borderRadius: '8px',
                        color: 'oklch(0.9 0 0)'
                      }}
                    />
                    <Bar dataKey="count" fill={COLORS.chart2} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confluence Factor Analysis</CardTitle>
                <CardDescription>Performance by confluence count</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={confluenceAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                    <XAxis dataKey="confluences" stroke="oklch(0.65 0.01 264)" fontSize={12} />
                    <YAxis yAxisId="left" stroke="oklch(0.65 0.01 264)" />
                    <YAxis yAxisId="right" orientation="right" stroke="oklch(0.65 0.01 264)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.2 0.01 264)',
                        border: '1px solid oklch(0.35 0.01 264)',
                        borderRadius: '8px',
                        color: 'oklch(0.9 0 0)'
                      }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="winRate" stroke={COLORS.primary} name="Win Rate (%)" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="avgPnL" stroke={COLORS.accent} name="Avg P&L ($)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Insights</CardTitle>
              <CardDescription>Statistical analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendUp size={18} className="text-primary" />
                    Strengths
                  </h4>
                  <div className="space-y-2 pl-6">
                    {metrics.avgWin > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Avg Win:</span>
                        <span className="ml-2 text-[oklch(0.75_0.2_145)] font-semibold">${metrics.avgWin.toFixed(2)}</span>
                      </div>
                    )}
                    {metrics.bestTrade > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Best Trade:</span>
                        <span className="ml-2 text-[oklch(0.75_0.2_145)] font-semibold">${metrics.bestTrade.toFixed(2)}</span>
                      </div>
                    )}
                    {pairPerformance.length > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Top Pair:</span>
                        <span className="ml-2 font-semibold">
                          {pairPerformance.sort((a, b) => b.pnl - a.pnl)[0]?.pair}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendDown size={18} className="text-destructive" />
                    Areas for Improvement
                  </h4>
                  <div className="space-y-2 pl-6">
                    {metrics.avgLoss > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Avg Loss:</span>
                        <span className="ml-2 text-[oklch(0.6_0.24_25)] font-semibold">${metrics.avgLoss.toFixed(2)}</span>
                      </div>
                    )}
                    {metrics.worstTrade < 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Worst Trade:</span>
                        <span className="ml-2 text-[oklch(0.6_0.24_25)] font-semibold">${metrics.worstTrade.toFixed(2)}</span>
                      </div>
                    )}
                    {metrics.avgDuration > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Avg Duration:</span>
                        <span className="ml-2 font-semibold">
                          {Math.floor(metrics.avgDuration / 60)}m {Math.floor(metrics.avgDuration % 60)}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
