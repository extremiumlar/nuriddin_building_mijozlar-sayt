import { Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CircleProgress } from '@/components/ui/ProgressBar'
import { FloorStatusRow } from './FloorStatusRow'
import { DeliveryCalculator } from './DeliveryCalculator'
import type { Block } from '@/types'

interface Props {
  block: Block
  onSelect?: (block: Block) => void
  expanded?: boolean
}

export function BlockProgressCard({ block, onSelect, expanded }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" />
              <h3 className="text-lg font-semibold text-ink">{block.name}</h3>
              <Badge tone={block.status === 'completed' ? 'success' : block.status === 'active' ? 'brand' : 'neutral'}>
                {block.status === 'active' ? 'Faol qurilish' : block.status === 'completed' ? 'Tugallangan' : 'Rejada'}
              </Badge>
            </div>
            <p className="text-sm text-ink-muted mt-1">
              {block.completedFloors} / {block.totalFloors} qavat tugadi
            </p>
          </div>
          <CircleProgress value={block.percentage} size={96} stroke={9} tone={block.percentage >= 70 ? 'success' : 'brand'} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <DeliveryCalculator block={block} />

        <div className={expanded ? 'space-y-2' : 'space-y-2 max-h-60 overflow-hidden'}>
          {block.floors
            .slice()
            .reverse()
            .map((floor, idx) => (
              <FloorStatusRow key={floor.id} floor={floor} delayMs={idx * 60} />
            ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Calendar className="h-3.5 w-3.5" />
          Topshirish:{' '}
          {new Date(block.deliveryDate).toLocaleDateString('uz-UZ', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
        {onSelect && (
          <Button variant="ghost" size="sm" onClick={() => onSelect(block)}>
            Batafsil
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
