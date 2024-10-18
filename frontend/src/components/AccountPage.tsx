import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Trophy, Scroll } from 'lucide-react'

interface Profile{
  score: string
  questionNo: string
  currentState: string  
  username : string
  email: string
  phoneNumber: string


}

export default function AccountPage() {
  // In a real application, you would fetch this data from an API or context
    var profile: Profile;
    const temp: string = localStorage.getItem('user') || ''
    profile = {username: 'not found', score: '0', email: 'not found', phoneNumber: 'not found', currentState: 'error', questionNo: '0',
    }
    if(profile){
    profile = JSON.parse(temp)
    }

  return (
    <div className="min-h-screen bg-blue-950/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            {/* <AvatarImage src={profile.avatarUrl} alt={profile.name} /> */}
            <AvatarFallback>{profile.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">{profile.username}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              <User className="w-4 h-6 mr-1 bg-" />
              {profile.email}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-gray-500" />
            <span>{profile.phoneNumber}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>High Score: {profile.score}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Scroll className="w-5 h-5 text-red-600" />
            <span>Chapter: {profile.currentState}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}