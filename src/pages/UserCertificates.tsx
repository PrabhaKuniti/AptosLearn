import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavSidebar } from "@/components/NavSidebar";
import { Certificate } from "@/components/Certificate";
import { useCourses } from "@/contexts/CourseContext";
import { Award, FileDown, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function UserCertificates() {
  const { certificates, userProfile } = useCourses();
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (index: number) => {
    setSelectedCertificate(index);
    setTimeout(async () => {
      if (certificateRef.current) {
        const canvas = await html2canvas(certificateRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "PNG", 0, 0);
        pdf.save(`${certificates[index].courseName}-certificate.pdf`);
      }
    }, 100); // Small delay to ensure render
  };

  return (
    <div className="flex h-screen bg-muted/40">
      <NavSidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Certificates</h1>
              <p className="text-muted-foreground">
                View and download your earned certificates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                <Award className="h-3.5 w-3.5 mr-1" />
                {certificates.length} Earned
              </Badge>
            </div>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((certificate, index) => (
                <Card
                  key={certificate.id}
                  className="p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <h3 className="text-lg font-semibold">{certificate.courseName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Issued on: {certificate.issueDate}
                        </p>
                      </div>
                      {certificate.blockchain && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      <Award className="h-4 w-4" />
                      <span className="text-sm">{certificate.tokenReward} APT tokens rewarded</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => setSelectedCertificate(index)}
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                        {selectedCertificate !== null && (
                          <Certificate
                            name={userProfile.username}
                            courseName={certificates[selectedCertificate].courseName}
                            date={certificates[selectedCertificate].issueDate}
                            tokenReward={certificates[selectedCertificate].tokenReward}
                          />
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="default"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleDownload(index)}
                    >
                      <FileDown className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <Award className="h-10 w-10 mx-auto mb-2 text-muted-foreground/60" />
              <h3 className="text-lg font-medium">No certificates yet</h3>
              <p className="text-muted-foreground">
                Complete courses to earn certificates and APT tokens
              </p>
              <Button className="mt-4" variant="outline">
                Browse Courses
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden certificate rendering for PDF generation */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div ref={certificateRef}>
          {selectedCertificate !== null && (
            <Certificate
              name={userProfile.username}
              courseName={certificates[selectedCertificate].courseName}
              date={certificates[selectedCertificate].issueDate}
              tokenReward={certificates[selectedCertificate].tokenReward}
            />
          )}
        </div>
      </div>
    </div>
  );
}
