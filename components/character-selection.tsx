"use client"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const characters = [
  {
    id: "bgmi",
    name: "BGMI Warrior",
    description: "A battle-hardened warrior with tactical skills and determination.",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Rebel",
    description: "A tech-savvy rebel with enhanced abilities and futuristic style.",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "doodle",
    name: "Doodle Hero",
    description: "A creative and colorful character with a unique hand-drawn style.",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "solo-leveling",
    name: "Solo Leveling Hunter",
    description: "A powerful hunter who grows stronger with each challenge overcome.",
    image: "/placeholder.svg?height=150&width=150",
  },
]

export default function CharacterSelection({ selectedCharacter, onSelect }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">Choose Your Character</h2>
        <p className="text-gray-500">Select a character that will represent you on your journey</p>
      </div>

      <RadioGroup value={selectedCharacter} onValueChange={onSelect} className="grid grid-cols-2 gap-4">
        {characters.map((character) => (
          <div key={character.id} className="relative">
            <RadioGroupItem value={character.id} id={character.id} className="sr-only" />
            <Label htmlFor={character.id} className="cursor-pointer">
              <Card
                className={`overflow-hidden transition-all ${
                  selectedCharacter === character.id
                    ? "ring-2 ring-purple-600 shadow-lg transform scale-[1.02]"
                    : "hover:shadow-md hover:scale-[1.01] transition-transform"
                }`}
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                    <img
                      src={character.image || "/placeholder.svg"}
                      alt={character.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{character.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{character.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
