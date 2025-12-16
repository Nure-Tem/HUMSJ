import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { 
  ArrowLeft, Upload, Image as ImageIcon, Video, Music, FileText, 
  Trash2, Download, Eye, Search, Filter, Grid, List, Plus,
  File, Camera, Mic, FolderOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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

const MediaLibrary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [uploadCategory, setUploadCategory] = useState("General");
  const [isDragOver, setIsDragOver] = useState(false);

  const categories = [
    "General", "News", "Events", "Charity", "Education", 
    "Community", "Leadership", "Programs", "Documents"
  ];

  useEffect(() => {
    checkAuth();
    fetchFiles();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [files, searchTerm, filterType, filterCategory]);

  const checkAuth = () => {
    if (!auth.currentUser) {
      navigate("/admin/login");
    }
  };

  const fetchFiles = async () => {
    try {
      const filesSnapshot = await getDocs(collection(db, "mediaLibrary"));
      const filesData = filesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaFile[];
      
      setFiles(filesData.sort((a, b) => b.uploadDate?.toDate() - a.uploadDate?.toDate()));
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to load media files",
        variant: "destructive",
      });
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

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(file => file.type === filterType);
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(file => file.category === filterCategory);
    }

    setFilteredFiles(filtered);
  };

  const getFileType = (file: File): 'image' | 'video' | 'audio' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'audio': return <Music className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleUpload = async (category: string = "General") => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileType = getFileType(file);
      
      // Validate file size based on type
      const maxSizes = {
        image: 10 * 1024 * 1024, // 10MB
        video: 100 * 1024 * 1024, // 100MB
        audio: 50 * 1024 * 1024, // 50MB
        document: 20 * 1024 * 1024 // 20MB
      };

      if (file.size > maxSizes[fileType]) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the size limit for ${fileType} files`,
          variant: "destructive",
        });
        failCount++;
        continue;
      }

      try {
        toast({
          title: "Uploading...",
          description: `Uploading ${file.name}`,
        });

        const url = await uploadToCloudinary(file);
        
        const fileData = {
          name: `${Date.now()}_${file.name}`,
          originalName: file.name,
          url,
          type: fileType,
          size: file.size,
          category,
          uploadDate: serverTimestamp(),
        };

        await addDoc(collection(db, "mediaLibrary"), fileData);
        successCount++;
        
        toast({
          title: "Upload Success",
          description: `${file.name} uploaded successfully`,
        });
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
        failCount++;
      }
    }

    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${successCount} files${failCount > 0 ? `, ${failCount} failed` : ''}`,
    });

    // Clear selected files and refresh
    setSelectedFiles(null);
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    
    fetchFiles();
    setIsUploading(false);
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      await deleteDoc(doc(db, "mediaLibrary", fileId));
      toast({
        title: "File Deleted",
        description: `${fileName} has been deleted`,
      });
      fetchFiles();
      setSelectedFile(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const FilePreview = ({ file }: { file: MediaFile }) => {
    switch (file.type) {
      case 'image':
        return (
          <img 
            src={file.url} 
            alt={file.originalName}
            className="w-full h-32 object-cover rounded-lg"
          />
        );
      case 'video':
        return (
          <video 
            src={file.url} 
            className="w-full h-32 object-cover rounded-lg"
            controls
          />
        );
      case 'audio':
        return (
          <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
            <Music className="h-12 w-12 text-purple-600" />
          </div>
        );
      default:
        return (
          <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
        );
    }
  };

  const DetailModal = ({ file, onClose }: { file: MediaFile; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="heading-blue">File Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="max-w-full">
              <FilePreview file={file} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Name:</span>
                <p className="text-gray-700">{file.originalName}</p>
              </div>
              <div>
                <span className="font-semibold">Type:</span>
                <p className="text-gray-700 capitalize">{file.type}</p>
              </div>
              <div>
                <span className="font-semibold">Size:</span>
                <p className="text-gray-700">{formatFileSize(file.size)}</p>
              </div>
              <div>
                <span className="font-semibold">Category:</span>
                <p className="text-gray-700">{file.category}</p>
              </div>
              <div>
                <span className="font-semibold">Upload Date:</span>
                <p className="text-gray-700">
                  {file.uploadDate?.toDate().toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-semibold">URL:</span>
                <p className="text-gray-700 break-all text-xs">{file.url}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button asChild className="flex-1">
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(file.id, file.originalName)}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          <Button onClick={onClose} className="mt-4 w-full" variant="outline">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold heading-blue">Media Library</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="library">Browse Library</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="heading-blue">Upload New Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">Images</p>
                    <p className="text-xs text-gray-500">Up to 10MB</p>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="sr-only"
                    />
                  </Card>
                  <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => document.getElementById('video-upload')?.click()}>
                    <Video className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">Videos</p>
                    <p className="text-xs text-gray-500">Up to 100MB</p>
                    <input
                      id="video-upload"
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="sr-only"
                    />
                  </Card>
                  <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => document.getElementById('audio-upload')?.click()}>
                    <Music className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-medium">Audio</p>
                    <p className="text-xs text-gray-500">Up to 50MB</p>
                    <input
                      id="audio-upload"
                      type="file"
                      multiple
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="sr-only"
                    />
                  </Card>
                  <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => document.getElementById('document-upload')?.click()}>
                    <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm font-medium">Documents</p>
                    <p className="text-xs text-gray-500">Up to 20MB</p>
                    <input
                      id="document-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                      onChange={handleFileSelect}
                      className="sr-only"
                    />
                  </Card>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={uploadCategory} onValueChange={setUploadCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                      isDragOver 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <Upload className={`mx-auto h-12 w-12 mb-4 ${
                        isDragOver ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <div>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-lg font-medium text-gray-900">
                            {isDragOver ? 'Drop files here' : 'Click to upload files or drag and drop'}
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            Multiple files supported • Images, Videos, Audio, Documents
                          </span>
                        </label>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                          onChange={handleFileSelect}
                          className="sr-only"
                        />
                      </div>
                    </div>
                  </div>

                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Selected Files:</h3>
                      {Array.from(selectedFiles).map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                          {getFileIcon(getFileType(file))}
                          <span className="flex-1">{file.name}</span>
                          <span className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    onClick={() => handleUpload(uploadCategory)} 
                    disabled={!selectedFiles || isUploading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isUploading ? "Uploading..." : `Upload ${selectedFiles?.length || 0} Files`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <div className="space-y-6">
              {/* Filters and Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-64">
                      <Input
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="document">Documents</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-32">
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
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Files Display */}
              {filteredFiles.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No files found</p>
                  </CardContent>
                </Card>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredFiles.map((file) => (
                    <Card key={file.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <FilePreview file={file} />
                        <div className="mt-3 space-y-2">
                          <h3 className="font-medium text-sm truncate" title={file.originalName}>
                            {file.originalName}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {getFileIcon(file.type)}
                            <span className="capitalize">{file.type}</span>
                            <span>•</span>
                            <span>{formatFileSize(file.size)}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedFile(file)}
                              className="flex-1"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="flex-1"
                            >
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3 w-3" />
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(file.id, file.originalName)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {filteredFiles.map((file) => (
                        <div key={file.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                          <div className="w-12 h-12 flex-shrink-0">
                            {file.type === 'image' ? (
                              <img 
                                src={file.url} 
                                alt={file.originalName}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                                {getFileIcon(file.type)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{file.originalName}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="capitalize">{file.type}</span>
                              <span>•</span>
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>{file.category}</span>
                              <span>•</span>
                              <span>{file.uploadDate?.toDate().toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedFile(file)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(file.id, file.originalName)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedFile && (
        <DetailModal file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}
    </div>
  );
};

export default MediaLibrary;