import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "@/contexts/CourseContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateProps {
  name?: string;
  courseName: string;
  date: string;
  verified?: boolean;
  tokenReward?: number;
}

export function Certificate({ name, courseName, date, verified = true, tokenReward = 0 }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { userProfile } = useCourses();

  const displayName = name || userProfile.username || "Learner";

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const positionY = (pageHeight - pdfHeight) / 2;

    pdf.addImage(imgData, "PNG", 0, positionY, pdfWidth, pdfHeight);
    pdf.save(`${displayName}_Certificate.pdf`);

    toast({
      title: "Downloaded Successfully",
      description: "Your certificate has been downloaded.",
    });
  };

  const printCertificate = () => {
    toast({
      title: "Print Certificate",
      description: "Use your browser's print dialog to print the certificate.",
    });
    window.print();
  };

  return (
    <div className="flex flex-col space-y-6">
      <div
        ref={certificateRef}
        className="bg-white p-8 border-8 border-double border-aptos-purple/20 rounded-md shadow-lg max-w-3xl mx-auto"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-aptos-blue to-aptos-purple flex items-center justify-center">
              <span className="text-white font-bold text-xl">AE</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1">AptosLearn</h1>
          <p className="text-sm text-gray-600 mb-2">Certificate of Completion</p>

          {verified && (
            <Badge
              variant="outline"
              className="mb-4 bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Certificate</span>
            </Badge>
          )}

          <p className="text-lg mb-2">This certifies that</p>
          <h2 className="text-3xl font-bold mb-2 text-aptos-purple">{displayName}</h2>
          <p className="text-lg mb-6">has successfully completed</p>

          <h3 className="text-2xl font-bold mb-8 px-10">{courseName}</h3>

          <div className="flex justify-between items-center w-full mt-8 pt-8 border-t">
            <div className="text-left">
              <p className="text-sm text-gray-600">Date</p>
              <p>{date}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Certified by</p>
              <p>AptosLearn Certification</p>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Certificate ID: APT-CERT-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            <p>Verify at aptoslearn.verify/cert</p>
            {tokenReward > 0 && (
              <p className="mt-1">Reward: {tokenReward} APT tokens</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={downloadCertificate}
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={printCertificate}
        >
          <Printer className="h-4 w-4" />
          <span>Print</span>
        </Button>
      </div>
    </div>
  );
}
