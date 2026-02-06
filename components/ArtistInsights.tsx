
import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { 
  BarChart3, TrendingUp, Users, Eye, Heart, Share2, 
  DollarSign, Target, Zap, AlertCircle, CheckCircle, 
  ArrowUp, ArrowDown, Minus, ArrowLeft, Loader2
} from 'lucide-react'
import { Box, Flex, Grid, Text, Button, Spacer } from '../flow'

interface ArtistInsightsProps {
  artistId: string
  onBack?: () => void
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color?: string
  format?: 'number' | 'currency' | 'percentage'
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = '#000',
  format = 'number'
}) => {
  const formatValue = (val: string | number) => {
    if (format === 'currency') return `$${Number(val).toLocaleString()}`
    if (format === 'percentage') return `${Number(val).toFixed(1)}%`
    return Number(val).toLocaleString()
  }

  return (
    <Box bg="white" border="1px solid #E5E5E5" p={3} borderRadius="4px">
      <Flex justify="between" align="center" mb={2}>
        <Text variant="label" color="#666">{title}</Text>
        <Box color={color}>{icon}</Box>
      </Flex>
      
      <Flex align="baseline" gap={1}>
        <Text size={32} weight="bold" tracking="-0.02em">{formatValue(value)}</Text>
        {change !== undefined && (
          <Flex align="center" gap={0.5}>
            {change > 0 ? <ArrowUp size={12} className="text-green-600" /> : <ArrowDown size={12} className="text-red-600" />}
            <Text size={12} weight="semibold" color={change > 0 ? "#166534" : "#991b1b"}>
              {Math.abs(change).toFixed(1)}%
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

const ArtistInsights: React.FC<ArtistInsightsProps> = ({ artistId, onBack }) => {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [activeTab, setActiveTab] = useState('overview')

  const loadInsights = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await (supabase.from('artworks').select('*').eq('artist_id', artistId) as any)
      
      // Real-world synthesis simulation
      setInsights({
        metrics: {
          total_views: 1240, view_growth: 12.5, unique_viewers: 840,
          revenue: 12450, revenue_growth: 8.4, conversion_rate: 3.2,
          engagement_rate: 18.4, follower_growth: 4.5
        }
      })
    } catch (error) {
      console.error('Neural analytics interrupt:', error)
    } finally {
      setLoading(false)
    }
  }, [artistId])

  useEffect(() => { loadInsights() }, [loadInsights])

  if (loading) {
    return (
      <Flex direction="column" align="center" justify="center" height="100vh">
        <Loader2 className="animate-spin mb-4" size={40} />
        <Text variant="label" color="#666">Synthesizing Market Data...</Text>
      </Flex>
    )
  }

  return (
    <Box bg="#FFFFFF" minHeight="100vh" pt={20}>
      <Helmet><title>Artist Insights | ArtFlow</title></Helmet>

      <Box maxWidth="1400px" mx="auto" px={2} py={4}>
        <Flex justify="between" align="end" mb={6}>
          <Box>
            <Button variant="no-border" onClick={onBack} className="mb-4">
              <Flex align="center" gap={1}>
                <ArrowLeft size={16} /> <Text variant="label">Back to Studio</Text>
              </Flex>
            </Button>
            <Text variant="h1" className="block">Performance <Text variant="italic">Ledger</Text>.</Text>
          </Box>

          <Flex bg="#F3F3F3" p={0.5} borderRadius="full">
            {['7d', '30d', '90d', '1y'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${period === p ? 'bg-black text-white shadow-sm' : 'text-[#666] hover:text-black'}`}
              >
                {p}
              </button>
            ))}
          </Flex>
        </Flex>

        <Grid cols={4} gap={2} mb={6}>
          <MetricCard title="Total Impressions" value={insights.metrics.total_views} change={insights.metrics.view_growth} icon={<Eye size={20} />} />
          <MetricCard title="Aesthetic Affinity" value={insights.metrics.engagement_rate} format="percentage" icon={<Heart size={20} />} />
          <MetricCard title="Gross Pipeline" value={insights.metrics.revenue} format="currency" change={insights.metrics.revenue_growth} icon={<DollarSign size={20} />} />
          <MetricCard title="Network Growth" value={insights.metrics.follower_growth} format="percentage" icon={<TrendingUp size={20} />} />
        </Grid>

        <Box bg="#F8F8F8" p={4} borderRadius="8px" border="1px solid #E5E5E5">
          <Flex align="center" gap={1} mb={4}>
            <Zap size={20} className="text-blue-100" />
            <Text variant="h2" size={24} weight="bold">Neural Signals</Text>
          </Flex>
          
          <Grid cols={3} gap={4}>
            {[
              { title: "Peak Discovery Window", desc: "Global interactions surge at 11 PM EST. Consider dropping new assets in this window.", icon: CheckCircle },
              { title: "Stylistic Shift", desc: "Abstract Minimalist vectors are converting 45% faster than Expressionist ones this month.", icon: TrendingUp },
              { title: "Region Focus", desc: "The Berlin sector shows high chromatic alignment with your primary palette.", icon: Target }
            ].map((insight, idx) => (
              <Box key={idx} bg="white" p={3} border="1px solid #E5E5E5">
                <Flex align="center" gap={1} mb={2}>
                  <insight.icon size={16} color="#1023D7" />
                  <Text weight="bold" size={14}>{insight.title}</Text>
                </Flex>
                <Text size={13} color="#666" lineHeight={1.5}>{insight.desc}</Text>
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default ArtistInsights;
