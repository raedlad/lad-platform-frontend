"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/components/ui/alert-dialog";
import { Button } from "@shared/components/ui/button";
import { Textarea } from "@shared/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, Edit3, Save, X, AlertCircle } from "lucide-react";
import { AdditionalClause } from "@/features/contract/types/contract";
import { useContractStore } from "@/features/contract/store/useContractStore";
import { useTranslations } from "next-intl";

interface AdditionalClausesEditorProps {
  isEditable: boolean;
}

export const AdditionalClausesEditor: React.FC<
  AdditionalClausesEditorProps
> = ({ isEditable }) => {
  const t = useTranslations("contract.clauses");
  const tCommon = useTranslations("common.actions");
  const { contract, updateAdditionalClauses } = useContractStore();
  const [open, setOpen] = useState(false);
  const [localClauses, setLocalClauses] = useState<AdditionalClause[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [newClauseText, setNewClauseText] = useState("");
  const [editingClauseId, setEditingClauseId] = useState<
    string | number | null
  >(null);
  const [editingText, setEditingText] = useState("");
  const [showNewClauseForm, setShowNewClauseForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [clauseToDelete, setClauseToDelete] = useState<string | number | null>(
    null
  );

  // Initialize local clauses when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalClauses([...contract.additionalClauses]);
      setHasChanges(false);
    }
  }, [open, contract.additionalClauses]);

  const handleAddClause = () => {
    if (newClauseText.trim()) {
      const newClause: AdditionalClause = {
        id: Date.now(),
        text: newClauseText.trim(),
      };
      setLocalClauses([...localClauses, newClause]);
      setHasChanges(true);
      setNewClauseText("");
      setShowNewClauseForm(false);
    }
  };

  const handleEditClause = (clause: AdditionalClause) => {
    setEditingClauseId(clause.id);
    setEditingText(clause.text);
  };

  const handleSaveEdit = () => {
    if (editingText.trim() && editingClauseId) {
      const updatedClauses = localClauses.map((clause) =>
        clause.id === editingClauseId
          ? { ...clause, text: editingText.trim() }
          : clause
      );
      setLocalClauses(updatedClauses);
      setHasChanges(true);
      setEditingClauseId(null);
      setEditingText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingClauseId(null);
    setEditingText("");
  };

  const handleDeleteClause = (id: string | number) => {
    setClauseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (clauseToDelete !== null) {
      setLocalClauses(localClauses.filter((c) => c.id !== clauseToDelete));
      setHasChanges(true);
      setClauseToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSaveChanges = () => {
    updateAdditionalClauses(localClauses);
    setHasChanges(false);
    setOpen(false);
  };

  const handleDiscardChanges = () => {
    setLocalClauses([...contract.additionalClauses]);
    setHasChanges(false);
    setNewClauseText("");
    setShowNewClauseForm(false);
    setEditingClauseId(null);
    setEditingText("");
    setOpen(false);
  };

  const handleCloseAttempt = () => {
    if (hasChanges) {
      setCloseConfirmOpen(true);
    } else {
      setOpen(false);
    }
  };

  if (!isEditable) {
    return (
      <Alert className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          {t("canOnlyBeEditedByClient")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCloseAttempt();
          } else {
            setOpen(isOpen);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 text-sm">
            <Edit3 className="w-5 h-5" />
            {t("title")}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              {t("title")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Existing Clauses */}
            <div className="space-y-3">
              {localClauses.map((clause) => (
                <div
                  key={clause.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  {editingClauseId === clause.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="min-h-[80px]"
                        placeholder={t("editClauseText")}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          className="gap-2"
                        >
                          <Save className="w-3 h-3" />
                          {tCommon("save")}
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          size="sm"
                          variant="outline"
                          className="gap-2"
                        >
                          <X className="w-3 h-3" />
                          {tCommon("cancel")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-sm flex-1 text-gray-900 dark:text-gray-100">
                        {clause.text}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditClause(clause)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClause(clause.id)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {localClauses.length === 0 && !showNewClauseForm && (
                <p className="text-sm text-muted-foreground dark:text-gray-400 italic text-center py-4">
                  {t("noAdditionalClauses")}
                </p>
              )}
            </div>

            {/* Add New Clause */}
            {showNewClauseForm ? (
              <div className="space-y-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Textarea
                  value={newClauseText}
                  onChange={(e) => setNewClauseText(e.target.value)}
                  className="min-h-[80px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  placeholder={t("enterNewClauseText")}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddClause} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t("addClause")}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNewClauseForm(false);
                      setNewClauseText("");
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    {tCommon("cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowNewClauseForm(true)}
                variant="outline"
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                {t("addClause")}
              </Button>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button onClick={handleDiscardChanges} variant="outline">
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={!hasChanges}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Confirmation */}
      <AlertDialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("unsavedChangesTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("unsavedChangesDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCloseConfirmOpen(false)}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscardChanges}
              className="bg-red-500 hover:bg-red-600"
            >
              {t("discardChanges")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
