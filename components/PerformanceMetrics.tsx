'use client';

interface PerformanceMetricsProps {
  processingTime?: number;
  activeLabs?: number;
  totalLabs?: number;
  confidence?: number;
  totalEpisodes?: number;
}

export default function PerformanceMetrics({
  processingTime,
  activeLabs = 0,
  totalLabs = 9,
  confidence,
  totalEpisodes = 0,
}: PerformanceMetricsProps) {
  const getProcessingTimeColor = (time?: number) => {
    if (!time) return 'text-nexus-gray';
    if (time < 50) return 'text-green-400';
    if (time < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard
        label="Processing Time"
        value={processingTime ? `${processingTime.toFixed(1)}ms` : '—'}
        valueClassName={getProcessingTimeColor(processingTime)}
      />
      
      <MetricCard
        label="Active LABs"
        value={`${activeLabs}/${totalLabs}`}
        valueClassName="text-nexus-primary"
      />
      
      {confidence !== undefined && (
        <MetricCard
          label="Confidence"
          value={`${(confidence * 100).toFixed(0)}%`}
          valueClassName="text-nexus-primary"
        />
      )}
      
      <MetricCard
        label="Total Episodes"
        value={totalEpisodes.toString()}
        valueClassName="text-nexus-white"
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-nexus-darker border border-nexus-gray/20 rounded-lg p-4">
      <div className="text-xs text-nexus-gray mb-1">{label}</div>
      <div className={`text-2xl font-bold font-mono ${valueClassName || 'text-nexus-white'}`}>
        {value}
      </div>
    </div>
  );
}
