import { Edit, Trash2 } from "lucide-react";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";

export interface HargaSampah {
  id: number;
  jenis: string;
  kategori: string;
  harga: number;
  satuan: string;
  status: string;
}

interface HargaSampahListProps {
  data: HargaSampah[];
  onEdit: (item: HargaSampah) => void;
  onDelete: (item: HargaSampah) => void;
}

export function HargaSampahList({ data, onEdit, onDelete }: HargaSampahListProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jenis Sampah</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Satuan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-gray-900">{item.jenis}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  {item.kategori}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-900">Rp {item.harga.toLocaleString()}</TableCell>
              <TableCell className="text-gray-600">per {item.satuan}</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-700 border-green-300" variant="outline">
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => onDelete(item)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
