'use client'

import { FileText, Volume2, Film, Video, CheckCircle } from 'lucide-react'

interface ProgressBarProps {
  progress: number
  status: string
}

const steps = [
  { key: 'generating_script', label: 'Generating Script', icon: FileText },
  { key: 'generating_voice', label: 'Generating Voice', icon: Volume2 },
  { key: 'fetching_clips', label: 'Fetching Clips', icon: Film },
  { key: 'rendering', label: 'Rendering Video', icon: Video },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
]

export default function ProgressBar({ progress, status }: ProgressBarProps) {
  const currentStepIndex = steps.findIndex(s => s.key === status)
  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative h-3 bg-dark-700 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
            isFailed ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-primary-400'
          }`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 loading-bar bg-white/20" />
        </div>
      </div>

      {/* Progress Text */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-white">
          {isFailed ? 'Failed' : `${progress}% Complete`}
        </span>
        <span className={`text-sm ${isFailed ? 'text-red-400' : 'text-primary-400'}`}>
          {steps[currentStepIndex]?.label || 'Processing...'}
        </span>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index <= currentStepIndex
          const isCurrent = index === currentStepIndex && !isCompleted

          return (
            <div
              key={step.key}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary-500/20'
                  : 'bg-dark-700/50'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-600 text-gray-500'
                } ${isCurrent ? 'animate-pulse' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-xs text-center ${
                  isActive ? 'text-primary-400' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
