


import { TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "../ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"

export function SectionCards() {
  return (
    <div className="flex-col flex-1 md:flex-row flex gap-5">
      <Card className="flex-1 bg-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            10
          </CardTitle>
          <CardDescription>Total Processes</CardDescription>
          <CardAction>
            <Badge variant="default">
              <TrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
    
      </Card>
      <Card className="flex-1 bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-destructive tabular-nums @[250px]/card:text-3xl">
            15
          </CardTitle>
          <CardDescription>Canceled Processes</CardDescription>
          <CardAction>
            <Badge variant="destructive">
              <TrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
    
      </Card>
      <Card className="flex-1 bg-secondary">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardDescription>Growth Rate</CardDescription>
          <CardAction>
            <Badge variant="secondary">
              <TrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
   
      </Card>
    </div>
  )
}