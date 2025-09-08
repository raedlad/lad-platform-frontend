"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Edit,
  Save,
  X,
  Wrench,
  Target,
  Users,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";

type UserRole =
  | "Engineering Office"
  | "Freelance Engineer"
  | "Contractor"
  | "Supplier";

export function ProfileTechnicalInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user role - this should come from user store/context
  const userRole: UserRole = "Engineering Office";

  // Mock technical data - replace with actual data from store/API
  const [technicalData, setTechnicalData] = useState({
    // Engineering Office specific
    officeSpecializations: [
      "Structural Engineering",
      "Civil Engineering",
      "MEP Engineering",
    ],
    yearsOfExperience: "More than 15 years",
    numberOfEmployees: "50-100",
    annualProjectVolume: "20-30 projects",
    geographicCoverage: ["Riyadh", "Jeddah", "Dammam", "Mecca"],
    officialAccreditations: true,

    // Freelance Engineer specific
    engineeringSpecialization: ["Structural Engineering", "Seismic Design"],
    typesOfExperience: [
      "Commercial Buildings",
      "Residential Projects",
      "Infrastructure",
    ],
    workLocations: ["Riyadh", "Eastern Province"],
    currentOfficeAffiliation: false,
    officeName: "",

    // Contractor specific
    projectSizeCompleted: "Over 50 million",
    targetProjectSize: ["25-50 million", "10-25 million"],
    totalEmployees: "100-300",
    governmentAccreditations: true,
    contractorClassification: "First through seventh classification",
    workFields: [
      "Commercial Construction",
      "Residential Development",
      "Infrastructure",
    ],
    geographicSpread: ["Central Region", "Eastern Region"],

    // Supplier specific
    supplyAreas: [
      "Construction Materials",
      "MEP Equipment",
      "Safety Equipment",
    ],
    serviceCoverage: ["Riyadh", "Eastern Province", "Western Province"],
    governmentPrivateDealings: true,

    // Common fields
    skills: ["AutoCAD", "Revit", "SAP2000", "ETABS", "Project Management"],
    software: ["AutoCAD", "Revit", "SAP2000", "ETABS", "MS Project"],
    languages: ["Arabic (Native)", "English (Fluent)", "French (Basic)"],
  });

  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Predefined options based on role
  const specializationOptions = {
    "Engineering Office": [
      "Structural Engineering",
      "Civil Engineering",
      "MEP Engineering",
      "Architectural Engineering",
      "Geotechnical Engineering",
      "Transportation Engineering",
      "Environmental Engineering",
      "Water Resources Engineering",
    ],
    "Freelance Engineer": [
      "Structural Engineering",
      "Civil Engineering",
      "MEP Engineering",
      "Architectural Engineering",
      "Geotechnical Engineering",
      "Project Management",
    ],
    Contractor: [
      "Commercial Construction",
      "Residential Development",
      "Infrastructure",
      "Industrial Construction",
      "Road Construction",
      "Bridge Construction",
    ],
    Supplier: [
      "Construction Materials",
      "MEP Equipment",
      "Safety Equipment",
      "Tools & Machinery",
      "Electrical Supplies",
      "Plumbing Supplies",
    ],
  };

  const softwareOptions = [
    "AutoCAD",
    "Revit",
    "SAP2000",
    "ETABS",
    "SAFE",
    "CSiBridge",
    "Tekla Structures",
    "Bentley MicroStation",
    "STAAD.Pro",
    "Robot Structural Analysis",
    "MS Project",
    "Primavera P6",
    "Navisworks",
    "BIM 360",
    "SketchUp",
  ];

  const saudiCities = [
    "Riyadh",
    "Jeddah",
    "Mecca",
    "Medina",
    "Dammam",
    "Khobar",
    "Dhahran",
    "Tabuk",
    "Buraidah",
    "Khamis Mushait",
    "Hail",
    "Hofuf",
    "Taif",
    "Jubail",
    "Yanbu",
    "Abha",
    "Najran",
    "Jazan",
    "Arar",
    "Sakaka",
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsEditing(false);
    console.log("Saving technical data:", technicalData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const handleInputChange = (field: string, value: any) => {
    setTechnicalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    setTechnicalData((prev) => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      }
    });
  };

  const addCustomSkill = () => {
    if (newSkill.trim() && !technicalData.skills.includes(newSkill.trim())) {
      setTechnicalData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setTechnicalData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const renderEngineeringOfficeFields = () => (
    <>
      {/* Office Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Office Specializations</CardTitle>
          <CardDescription>
            Select the engineering disciplines your office specializes in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specializationOptions["Engineering Office"].map(
              (specialization) => (
                <div
                  key={specialization}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={specialization}
                    checked={technicalData.officeSpecializations.includes(
                      specialization
                    )}
                    onCheckedChange={(checked) =>
                      handleArrayChange(
                        "officeSpecializations",
                        specialization,
                        checked as boolean
                      )
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor={specialization} className="text-sm">
                    {specialization}
                  </Label>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Office Details */}
      <Card>
        <CardHeader>
          <CardTitle>Office Details</CardTitle>
          <CardDescription>
            Information about your office capacity and experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              {isEditing ? (
                <Select
                  value={technicalData.yearsOfExperience}
                  onValueChange={(value) =>
                    handleInputChange("yearsOfExperience", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Less than 5 years">
                      Less than 5 years
                    </SelectItem>
                    <SelectItem value="5-10 years">5-10 years</SelectItem>
                    <SelectItem value="10-15 years">10-15 years</SelectItem>
                    <SelectItem value="15-20 years">15-20 years</SelectItem>
                    <SelectItem value="More than 20 years">
                      More than 20 years
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {technicalData.yearsOfExperience}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfEmployees">Number of Employees</Label>
              {isEditing ? (
                <Select
                  value={technicalData.numberOfEmployees}
                  onValueChange={(value) =>
                    handleInputChange("numberOfEmployees", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Less than 10">Less than 10</SelectItem>
                    <SelectItem value="10-30">10-30</SelectItem>
                    <SelectItem value="30-50">30-50</SelectItem>
                    <SelectItem value="50-100">50-100</SelectItem>
                    <SelectItem value="More than 100">More than 100</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {technicalData.numberOfEmployees}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualProjectVolume">Annual Project Volume</Label>
              {isEditing ? (
                <Select
                  value={technicalData.annualProjectVolume}
                  onValueChange={(value) =>
                    handleInputChange("annualProjectVolume", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Less than 10 projects">
                      Less than 10 projects
                    </SelectItem>
                    <SelectItem value="10-20 projects">
                      10-20 projects
                    </SelectItem>
                    <SelectItem value="20-30 projects">
                      20-30 projects
                    </SelectItem>
                    <SelectItem value="30-50 projects">
                      30-50 projects
                    </SelectItem>
                    <SelectItem value="More than 50 projects">
                      More than 50 projects
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {technicalData.annualProjectVolume}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderFreelanceEngineerFields = () => (
    <>
      {/* Engineering Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Engineering Specializations</CardTitle>
          <CardDescription>
            Select your areas of engineering expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specializationOptions["Freelance Engineer"].map(
              (specialization) => (
                <div
                  key={specialization}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={specialization}
                    checked={technicalData.engineeringSpecialization.includes(
                      specialization
                    )}
                    onCheckedChange={(checked) =>
                      handleArrayChange(
                        "engineeringSpecialization",
                        specialization,
                        checked as boolean
                      )
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor={specialization} className="text-sm">
                    {specialization}
                  </Label>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Experience Types */}
      <Card>
        <CardHeader>
          <CardTitle>Types of Experience</CardTitle>
          <CardDescription>
            Select the types of projects you have experience with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Commercial Buildings",
              "Residential Projects",
              "Infrastructure",
              "Industrial Projects",
              "Healthcare Facilities",
              "Educational Buildings",
            ].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={technicalData.typesOfExperience.includes(type)}
                  onCheckedChange={(checked) =>
                    handleArrayChange(
                      "typesOfExperience",
                      type,
                      checked as boolean
                    )
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor={type} className="text-sm">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderContractorFields = () => (
    <>
      {/* Contractor Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Contractor Specializations</CardTitle>
          <CardDescription>
            Select your areas of construction expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specializationOptions.Contractor.map((specialization) => (
              <div key={specialization} className="flex items-center space-x-2">
                <Checkbox
                  id={specialization}
                  checked={technicalData.workFields.includes(specialization)}
                  onCheckedChange={(checked) =>
                    handleArrayChange(
                      "workFields",
                      specialization,
                      checked as boolean
                    )
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor={specialization} className="text-sm">
                  {specialization}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Size */}
      <Card>
        <CardHeader>
          <CardTitle>Project Size & Capacity</CardTitle>
          <CardDescription>
            Your project completion history and target project sizes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectSizeCompleted">
                Largest Project Completed
              </Label>
              {isEditing ? (
                <Select
                  value={technicalData.projectSizeCompleted}
                  onValueChange={(value) =>
                    handleInputChange("projectSizeCompleted", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Less than 10 million">
                      Less than 10 million
                    </SelectItem>
                    <SelectItem value="10-25 million">10-25 million</SelectItem>
                    <SelectItem value="25-50 million">25-50 million</SelectItem>
                    <SelectItem value="Over 50 million">
                      Over 50 million
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {technicalData.projectSizeCompleted}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalEmployees">Total Employees</Label>
              {isEditing ? (
                <Select
                  value={technicalData.totalEmployees}
                  onValueChange={(value) =>
                    handleInputChange("totalEmployees", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Less than 50">Less than 50</SelectItem>
                    <SelectItem value="50-100">50-100</SelectItem>
                    <SelectItem value="100-300">100-300</SelectItem>
                    <SelectItem value="Over 300">Over 300</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {technicalData.totalEmployees}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderSupplierFields = () => (
    <>
      {/* Supply Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Areas</CardTitle>
          <CardDescription>
            Select the areas where you supply materials and equipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specializationOptions.Supplier.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={area}
                  checked={technicalData.supplyAreas.includes(area)}
                  onCheckedChange={(checked) =>
                    handleArrayChange("supplyAreas", area, checked as boolean)
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor={area} className="text-sm">
                  {area}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Coverage */}
      <Card>
        <CardHeader>
          <CardTitle>Service Coverage</CardTitle>
          <CardDescription>
            Geographic areas where you provide supply services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {technicalData.serviceCoverage.map((region) => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox
                  id={region}
                  checked={technicalData.serviceCoverage.includes(region)}
                  onCheckedChange={(checked) =>
                    handleArrayChange(
                      "serviceCoverage",
                      region,
                      checked as boolean
                    )
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor={region} className="text-sm">
                  {region}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderRoleSpecificFields = () => {
    switch (userRole as UserRole) {
      case "Engineering Office":
        return renderEngineeringOfficeFields();
      case "Freelance Engineer":
        return renderFreelanceEngineerFields();
      case "Contractor":
        return renderContractorFields();
      case "Supplier":
        return renderSupplierFields();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Technical Information</span>
              </CardTitle>
              <CardDescription>
                Your technical skills, software proficiency, and specializations
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Role-specific fields */}
      {renderRoleSpecificFields()}

      {/* Geographic Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Geographic Coverage</span>
          </CardTitle>
          <CardDescription>
            Select the cities and regions where you operate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {saudiCities.map((city) => (
              <div key={city} className="flex items-center space-x-2">
                <Checkbox
                  id={city}
                  checked={technicalData.geographicCoverage.includes(city)}
                  onCheckedChange={(checked) =>
                    handleArrayChange(
                      "geographicCoverage",
                      city,
                      checked as boolean
                    )
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor={city} className="text-sm">
                  {city}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
          <CardDescription>
            Your technical competencies and areas of expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {technicalData.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                />
                <Button onClick={addCustomSkill} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Software Proficiency */}
      <Card>
        <CardHeader>
          <CardTitle>Software Proficiency</CardTitle>
          <CardDescription>
            Engineering and design software you are proficient with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {softwareOptions.map((software) => (
              <div key={software} className="flex items-center space-x-2">
                <Checkbox
                  id={software}
                  checked={technicalData.software.includes(software)}
                  onCheckedChange={(checked) =>
                    handleArrayChange("software", software, checked as boolean)
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor={software} className="text-sm">
                  {software}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
          <CardDescription>
            Languages you speak and your proficiency level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technicalData.languages.map((language) => (
              <Badge key={language} variant="outline">
                {language}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accreditations */}
      {(userRole === "Engineering Office" || userRole === "Contractor") && (
        <Card>
          <CardHeader>
            <CardTitle>Official Accreditations</CardTitle>
            <CardDescription>
              Professional accreditations and certifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="officialAccreditations"
                  checked={technicalData.officialAccreditations}
                  onCheckedChange={(checked) =>
                    handleInputChange("officialAccreditations", checked)
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor="officialAccreditations">
                  We have official accreditations from relevant authorities
                </Label>
              </div>

              {technicalData.officialAccreditations && (
                <div className="pl-6 space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Please upload your accreditation documents in the Documents
                    section.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
