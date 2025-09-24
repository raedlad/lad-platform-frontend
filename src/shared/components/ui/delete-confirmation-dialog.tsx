"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Loader2,
  Trash2,
  AlertTriangle,
  RefreshCw as RefreshCwIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DeleteConfirmationDialogProps {
  /** Trigger element that opens the dialog */
  children: React.ReactNode;
  /** Title of the item being deleted */
  itemTitle: string;
  /** Description of what will be deleted */
  itemDescription?: string;
  /** Function to execute when delete is confirmed */
  onConfirm: () => Promise<void> | void;
  /** Optional callback when delete is successful */
  onSuccess?: () => void;
  /** Optional callback when delete fails */
  onError?: (error: string) => void;
  /** Custom delete button text */
  deleteButtonText?: string;
  /** Custom cancel button text */
  cancelButtonText?: string;
  /** Whether the delete action is destructive (red button) */
  destructive?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Disable the dialog */
  disabled?: boolean;
}

/**
 * Reusable delete confirmation dialog with loading and error management
 * - Handles async delete operations
 * - Shows loading state during deletion
 * - Manages error states with retry option
 * - Customizable text and styling
 */
const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  children,
  itemTitle,
  itemDescription,
  onConfirm,
  onSuccess,
  onError,
  deleteButtonText = "Delete",
  cancelButtonText = "Cancel",
  destructive = true,
  className,
  disabled = false,
}) => {
  const t = useTranslations("profile.documents.upload.deleteDialog");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm();
      setIsOpen(false);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete item";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      setError(null);
    }
    setIsOpen(open);
  };

  const handleRetry = () => {
    setError(null);
    handleConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("sm:max-w-md w-full mx-4", className)}>
        <AlertDialogHeader>
          <div className="flex flex-col  items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 flex-shrink-0">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <AlertDialogTitle className="text-center text-base sm:text-lg">{t("title", { fileName: itemTitle })}</AlertDialogTitle>
              <AlertDialogDescription className=" text-sm mt-1">
                {itemDescription || t("description", { fileName: itemTitle })}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Error State */}
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm min-w-0 flex-1">
                <p className="font-medium text-destructive mb-1">
                  {t("deleteFailed")}
                </p>
                <p className="text-destructive/80 break-words">{error}</p>
              </div>
            </div>
          </div>
        )}

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          {error ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                {t("cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleRetry}
                disabled={isDeleting}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("retrying")}
                  </>
                ) : (
                  <>
                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                    {t("retry")}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex justify-end flex-col sm:flex-row gap-2 w-full">
              <AlertDialogCancel
                disabled={isDeleting}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                {cancelButtonText}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                disabled={isDeleting}
                className={cn(
                  "w-full sm:w-auto order-1 sm:order-2",
                  destructive &&
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                )}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("deleting")}
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleteButtonText}
                  </>
                )}
              </AlertDialogAction>
            </div>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
