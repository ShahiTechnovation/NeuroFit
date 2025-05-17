"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fields = {
  academic: [
    { id: "jee", name: "JEE Preparation", description: "Prepare for Joint Entrance Examination" },
    { id: "upsc", name: "UPSC", description: "Civil Services Examination preparation" },
    { id: "neet", name: "NEET", description: "Medical entrance examination preparation" },
    { id: "gate", name: "GATE", description: "Graduate Aptitude Test in Engineering" },
  ],
  skills: [
    { id: "coding", name: "Coding", description: "Learn programming and software development" },
    { id: "design", name: "Design", description: "Graphic design, UI/UX, and digital art" },
    { id: "language", name: "Languages", description: "Learn new languages and improve communication" },
    { id: "finance", name: "Finance", description: "Personal finance, investing, and financial literacy" },
  ],
  health: [
    { id: "fitness", name: "Fitness", description: "Physical training, workouts, and exercise routines" },
    { id: "nutrition", name: "Nutrition", description: "Healthy eating habits and meal planning" },
    { id: "mindfulness", name: "Mindfulness", description: "Meditation, stress management, and mental wellness" },
    { id: "sleep", name: "Sleep", description: "Improve sleep quality and establish healthy sleep patterns" },
  ],
}

export default function FieldSelection({ selectedFields, onSelect }) {
  const handleToggleField = (fieldId) => {
    if (selectedFields.includes(fieldId)) {
      onSelect(selectedFields.filter((id) => id !== fieldId))
    } else {
      onSelect([...selectedFields, fieldId])
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">Select Your Development Fields</h2>
        <p className="text-gray-500">Choose the areas you want to focus on (select at least one, up to five)</p>
      </div>

      <Tabs defaultValue="academic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="health">Health & Wellness</TabsTrigger>
        </TabsList>

        <TabsContent value="academic" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.academic.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                isSelected={selectedFields.includes(field.id)}
                onToggle={handleToggleField}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.skills.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                isSelected={selectedFields.includes(field.id)}
                onToggle={handleToggleField}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="health" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.health.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                isSelected={selectedFields.includes(field.id)}
                onToggle={handleToggleField}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedFields.length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-medium mb-2">Selected Fields ({selectedFields.length}/5):</h3>
          <div className="flex flex-wrap gap-2">
            {selectedFields.map((fieldId) => {
              const field = [...fields.academic, ...fields.skills, ...fields.health].find((f) => f.id === fieldId)
              return (
                <div key={fieldId} className="bg-white px-3 py-1 rounded-full text-sm border">
                  {field?.name}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function FieldCard({ field, isSelected, onToggle }) {
  return (
    <Card className={`overflow-hidden transition-all ${isSelected ? "ring-2 ring-purple-600" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox id={field.id} checked={isSelected} onCheckedChange={() => onToggle(field.id)} />
          <div>
            <Label htmlFor={field.id} className="font-medium cursor-pointer">
              {field.name}
            </Label>
            <p className="text-sm text-gray-500 mt-1">{field.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
