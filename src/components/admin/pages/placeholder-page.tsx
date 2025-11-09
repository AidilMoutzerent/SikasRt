import { Construction } from "lucide-react";
import { Card, CardContent } from "../../ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Construction className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">Halaman Sedang Dikembangkan</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Fitur {title.toLowerCase()} sedang dalam tahap pengembangan dan akan segera tersedia.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
