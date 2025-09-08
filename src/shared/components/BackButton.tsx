import { Button } from '@/shared/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const BackButton = ({ href }: { href: string }) => {
  return (
      <div>
        <Link href={href}>
        <Button variant="outline" size="sm" >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        </Link>
      </div>
  )
}

export default BackButton
