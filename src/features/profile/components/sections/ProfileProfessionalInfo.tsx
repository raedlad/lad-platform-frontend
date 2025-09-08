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
import {
  Edit,
  Save,
  X,
  Briefcase,
  GraduationCap,
  Award,
  Building,
  Plus,
  Trash2,
} from "lucide-react";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

interface Education {
  id: string;
  organization: string;
  degree: string;
  field: string;
  graduationYear: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export function ProfileProfessionalInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user role - this should come from user store/context
  const userRole = "Engineering Office";

  // Mock professional data - replace with actual data from store/API
  const [professionalData, setProfessionalData] = useState({
    currentPosition: "Senior Structural Engineer",
    yearsOfExperience: "12",
    specializations: [
      "Structural Engineering",
      "Seismic Design",
      "Building Information Modeling",
    ],
    licenseNumber: "ENG-2024-001234",
    licenseIssuer: "Saudi Council of Engineers",
    licenseExpiryDate: "2026-12-31",
    companyName: "Al-Rashid Engineering Consultants",
    companySize: "50-100 employees",
    companyEstablished: "2010",
    companyDescription:
      "Leading engineering consultancy specializing in structural and civil engineering projects across Saudi Arabia.",
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "Al-Rashid Engineering Consultants",
      position: "Senior Structural Engineer",
      startDate: "2020-01",
      endDate: "",
      isCurrent: true,
      description:
        "Lead structural design for commercial and residential projects. Manage a team of 5 engineers and coordinate with international consultants.",
    },
    {
      id: "2",
      company: "Saudi Engineering Group",
      position: "Structural Engineer",
      startDate: "2015-03",
      endDate: "2019-12",
      isCurrent: false,
      description:
        "Designed structural systems for high-rise buildings and infrastructure projects. Specialized in seismic analysis and design.",
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      organization: "King Fahd University of Petroleum and Minerals",
      degree: "Master of Science",
      field: "Structural Engineering",
      graduationYear: "2014",
    },
    {
      id: "2",
      organization: "King Saud University",
      degree: "Bachelor of Science",
      field: "Civil Engineering",
      graduationYear: "2012",
    },
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      name: "Professional Engineer (PE)",
      issuer: "Saudi Council of Engineers",
      issueDate: "2015-06",
      expiryDate: "2026-06",
      credentialId: "PE-2015-5678",
    },
    {
      id: "2",
      name: "Project Management Professional (PMP)",
      issuer: "Project Management Institute",
      issueDate: "2018-09",
      expiryDate: "2027-09",
      credentialId: "PMP-2018-9012",
    },
  ]);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsEditing(false);
    console.log("Saving professional data:", {
      professionalData,
      experiences,
      education,
      certifications,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const handleInputChange = (field: string, value: string) => {
    setProfessionalData((prev) => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    };
    setExperiences((prev) => [...prev, newExperience]);
  };

  const removeExperience = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      organization: "",
      degree: "",
      field: "",
      graduationYear: "",
    };
    setEducation((prev) => [...prev, newEducation]);
  };

  const removeEducation = (id: string) => {
    setEducation((prev) => prev.filter((edu) => edu.id !== id));
  };

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
    };
    setCertifications((prev) => [...prev, newCertification]);
  };

  const removeCertification = (id: string) => {
    setCertifications((prev) => prev.filter((cert) => cert.id !== id));
  };

  // Show different fields based on user role
  const showCompanyInfo = [
    "Engineering Office",
    "Contractor",
    "Supplier",
  ].includes(userRole);
  const showLicenseInfo = [
    "Engineering Office",
    "Freelance Engineer",
    "Contractor",
  ].includes(userRole);

  return (
    <div className="space-y-6">
      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Professional Summary</span>
              </CardTitle>
              <CardDescription>
                Your current role and professional background
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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Position */}
            <div className="space-y-2">
              <Label htmlFor="currentPosition">Current Position</Label>
              {isEditing ? (
                <Input
                  id="currentPosition"
                  value={professionalData.currentPosition}
                  onChange={(e) =>
                    handleInputChange("currentPosition", e.target.value)
                  }
                />
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {professionalData.currentPosition}
                </p>
              )}
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              {isEditing ? (
                <Input
                  id="yearsOfExperience"
                  type="number"
                  value={professionalData.yearsOfExperience}
                  onChange={(e) =>
                    handleInputChange("yearsOfExperience", e.target.value)
                  }
                />
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {professionalData.yearsOfExperience} years
                </p>
              )}
            </div>

            {/* Specializations */}
            <div className="space-y-2 md:col-span-2">
              <Label>Specializations</Label>
              <div className="flex flex-wrap gap-2">
                {professionalData.specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional License */}
      {showLicenseInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Professional License</span>
            </CardTitle>
            <CardDescription>
              Your professional licensing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                {isEditing ? (
                  <Input
                    id="licenseNumber"
                    value={professionalData.licenseNumber}
                    onChange={(e) =>
                      handleInputChange("licenseNumber", e.target.value)
                    }
                  />
                ) : (
                  <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {professionalData.licenseNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseIssuer">Issuing Authority</Label>
                {isEditing ? (
                  <Input
                    id="licenseIssuer"
                    value={professionalData.licenseIssuer}
                    onChange={(e) =>
                      handleInputChange("licenseIssuer", e.target.value)
                    }
                  />
                ) : (
                  <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {professionalData.licenseIssuer}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseExpiryDate">Expiry Date</Label>
                {isEditing ? (
                  <Input
                    id="licenseExpiryDate"
                    type="date"
                    value={professionalData.licenseExpiryDate}
                    onChange={(e) =>
                      handleInputChange("licenseExpiryDate", e.target.value)
                    }
                  />
                ) : (
                  <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {new Date(
                      professionalData.licenseExpiryDate
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Information */}
      {showCompanyInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Company Information</span>
            </CardTitle>
            <CardDescription>
              Details about your company or organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                {isEditing ? (
                  <Input
                    id="companyName"
                    value={professionalData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                  />
                ) : (
                  <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {professionalData.companyName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                {isEditing ? (
                  <Input
                    id="companySize"
                    value={professionalData.companySize}
                    onChange={(e) =>
                      handleInputChange("companySize", e.target.value)
                    }
                  />
                ) : (
                  <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {professionalData.companySize}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEstablished">Established Year</Label>
                {isEditing ? (
                  <Input
                    id="companyEstablished"
                    type="number"
                    value={professionalData.companyEstablished}
                    onChange={(e) =>
                      handleInputChange("companyEstablished", e.target.value)
                    }
                  />
                ) : (
                  <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {professionalData.companyEstablished}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                {isEditing ? (
                  <Textarea
                    id="companyDescription"
                    value={professionalData.companyDescription}
                    onChange={(e) =>
                      handleInputChange("companyDescription", e.target.value)
                    }
                    rows={3}
                  />
                ) : (
                  <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {professionalData.companyDescription}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Your professional work history</CardDescription>
            </div>
            {isEditing && (
              <Button variant="outline" onClick={addExperience}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <div key={experience.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Experience {index + 1}</h4>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience(experience.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    {isEditing ? (
                      <Input value={experience.company} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {experience.company}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    {isEditing ? (
                      <Input value={experience.position} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {experience.position}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    {isEditing ? (
                      <Input type="month" value={experience.startDate} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {new Date(experience.startDate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long" }
                        )}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    {isEditing ? (
                      <Input
                        type="month"
                        value={experience.endDate}
                        disabled={experience.isCurrent}
                      />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {experience.isCurrent
                          ? "Present"
                          : new Date(experience.endDate).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "long" }
                            )}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    {isEditing ? (
                      <Textarea value={experience.description} rows={3} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {experience.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Education</span>
              </CardTitle>
              <CardDescription>Your educational background</CardDescription>
            </div>
            {isEditing && (
              <Button variant="outline" onClick={addEducation}>
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={edu.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Education {index + 1}</h4>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    {isEditing ? (
                      <Input value={edu.organization} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {edu.organization}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    {isEditing ? (
                      <Input value={edu.degree} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {edu.degree}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    {isEditing ? (
                      <Input value={edu.field} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {edu.field}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    {isEditing ? (
                      <Input type="number" value={edu.graduationYear} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {edu.graduationYear}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Certifications</span>
              </CardTitle>
              <CardDescription>
                Your professional certifications and credentials
              </CardDescription>
            </div>
            {isEditing && (
              <Button variant="outline" onClick={addCertification}>
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={cert.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Certification {index + 1}</h4>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCertification(cert.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Certification Name</Label>
                    {isEditing ? (
                      <Input value={cert.name} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {cert.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization</Label>
                    {isEditing ? (
                      <Input value={cert.issuer} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {cert.issuer}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    {isEditing ? (
                      <Input type="month" value={cert.issueDate} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {new Date(cert.issueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    {isEditing ? (
                      <Input type="month" value={cert.expiryDate || ""} />
                    ) : (
                      <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {cert.expiryDate
                          ? new Date(cert.expiryDate).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "long" }
                            )
                          : "No expiry"}
                      </p>
                    )}
                  </div>
                  {cert.credentialId && (
                    <div className="space-y-2 md:col-span-2">
                      <Label>Credential ID</Label>
                      {isEditing ? (
                        <Input value={cert.credentialId} />
                      ) : (
                        <p className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          {cert.credentialId}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
