import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Trophy } from 'lucide-react'

import { useAuth } from './AuthContext' 

interface Profile{
    username : string
    highscore: number
    email: string
    phoneNumber: string
}

export default function AccountPage() {
  // In a real application, you would fetch this data from an API or context
    var profile: Profile;
    const temp: string = localStorage.getItem('user')
    profile = {username: 'not found', highscore: 0, email: 'not found', phoneNumber: 'not found'}
    if(profile){
    profile = JSON.parse(temp)

    
}

    

    


  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            {/* <AvatarImage src={profile.avatarUrl} alt={profile.name} /> */}
            <AvatarFallback>{profile.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">{profile.username}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              <User className="w-4 h-4 mr-1" />
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
            <span>High Score: {profile.highscore}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}