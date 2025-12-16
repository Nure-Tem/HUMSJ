import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Image as ImageIcon, Video, Music, FileText, Search, Check } from "lucide-react";

interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  uploadDate: any;
  category: string;
}

interface MediaSelectorProps {
  onSelect: (file: MediaFile) => void;
  selectedFile?: MediaFile | null;
  fileType?: 'image' | 'video' | 'audio' | 'document' | 'all';
  trigger?: React.ReactNode;
}

export const MediaSelector = ({ onSelect, selectedFile, fileType = 'all', trigger }: MediaSelectorProps) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "General", "News", "Events", "Charity", "Education", 
    "Community", "Leadership", "Programs", "Documents"
  ];

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen]);

  useEffect(() => {
    filterFiles();
  }, [files, searchTerm, filterCategory, fileType]);

  const fetchFiles = async () => {
    try {
      let q = query(collection(db, "mediaLibrary"), orderBy("uploadDate", "desc"));
      
      if (fileType !== 'all') {
        q = query(collection(db, "mediaLibrary"), where("type", "==", fileType), orderBy("uploadDate", "desc"));
      }

      const filesSnapshot = await getDocs(q);
      const filesData = filesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaFile[];
      
      setFiles(filesData);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const filterFiles = () => {
    let filtered = files;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(file => file.category === filterCategory);
    }

    setFilteredFiles(filtered);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSelect = (file: MediaFile) => {
    onSelect(file);
    setIsOpen(false);
  };

  const FilePreview = ({ file }: { file: MediaFile }) => {
    switch (file.type) {
      case 'image':
        return (
          <img 
            src={file.url} 
            alt={file.originalName}
            className="w-full h-24 object-cover rounded"
          />
        );
      case 'video':
        return (
          <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
            <Video className="h-8 w-8 text-blue-600" />
          </div>
        );
      case 'audio':
        return (
          <div className="w-full h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center">
            <Music className="h-8 w-8 text-purple-600" />
          </div>
        );
      default:
        return (
          <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
            <FileText className="h-8 w-8 text-gray-600" />
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" type="button">
            Select from Library
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Media File</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Files Grid */}
          <div className="max-h-96 overflow-y-auto">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No files found
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <Card 
                    key={file.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedFile?.id === file.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => handleSelect(file)}
                  >
                    <CardContent className="p-3">
                      <FilePreview file={file} />
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {getFileIcon(file.type)}
                            <span className="text-xs text-gray-500 capitalize">{file.type}</span>
                          </div>
                          {selectedFile?.id === file.id && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <h4 className="text-sm font-medium truncate" title={file.originalName}>
                          {file.originalName}
                        </h4>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};