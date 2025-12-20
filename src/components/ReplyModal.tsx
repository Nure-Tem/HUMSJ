import { useState } from "react";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Send, X, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Reply {
  message: string;
  repliedBy: string;
  repliedAt: any;
}

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
  collectionName: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  existingReplies?: Reply[];
  themeColor?: 'emerald' | 'blue' | 'amber' | 'purple';
  onReplySuccess?: () => void;
}

const ReplyModal = ({
  isOpen,
  onClose,
  submissionId,
  collectionName,
  recipientName,
  recipientEmail,
  recipientPhone,
  existingReplies = [],
  themeColor = 'purple',
  onReplySuccess,
}: ReplyModalProps) => {
  const { toast } = useToast();
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorClasses = {
    emerald: { bg: 'bg-emerald-600 hover:bg-emerald-700', text: 'text-emerald-700', light: 'bg-emerald-50' },
    blue: { bg: 'bg-blue-600 hover:bg-blue-700', text: 'text-blue-700', light: 'bg-blue-50' },
    amber: { bg: 'bg-amber-600 hover:bg-amber-700', text: 'text-amber-700', light: 'bg-amber-50' },
    purple: { bg: 'bg-purple-600 hover:bg-purple-700', text: 'text-purple-700', light: 'bg-purple-50' },
  };

  const colors = colorClasses[themeColor];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleSubmitReply = async () => {
    if (!replyMessage.trim()) {
      toast({ title: "Error", description: "Please enter a reply message", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const replyData = {
        message: replyMessage.trim(),
        repliedBy: auth.currentUser?.email || "Admin",
        repliedAt: new Date().toISOString(),
      };

      // Update the document with the new reply
      await updateDoc(doc(db, collectionName, submissionId), {
        replies: arrayUnion(replyData),
        lastReplyAt: serverTimestamp(),
        status: "replied",
      });

      toast({
        title: "Reply Sent!",
        description: `Your reply has been saved for ${recipientName}`,
      });

      setReplyMessage("");
      onReplySuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Reply error:", error);
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className={colors.text}>Reply to {recipientName}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recipient Info */}
          <div className={`p-4 rounded-lg ${colors.light}`}>
            <p className="font-semibold mb-2">Recipient Information:</p>
            <p className="text-sm">Name: {recipientName}</p>
            {recipientEmail && <p className="text-sm">Email: {recipientEmail}</p>}
            {recipientPhone && <p className="text-sm">Phone: {recipientPhone}</p>}
          </div>

          {/* Previous Replies */}
          {existingReplies.length > 0 && (
            <div className="space-y-3">
              <p className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Previous Replies ({existingReplies.length})
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {existingReplies.map((reply, index) => (
                  <div key={index} className="p-3 bg-gray-100 rounded-lg text-sm">
                    <p className="text-gray-800">{reply.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(reply.repliedAt)}</span>
                      <span>by {reply.repliedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Reply */}
          <div className="space-y-2">
            <Label htmlFor="reply">Your Reply</Label>
            <Textarea
              id="reply"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply message here..."
              rows={5}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              className={colors.bg}
              onClick={handleSubmitReply}
              disabled={isSubmitting || !replyMessage.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send Reply"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReplyModal;
