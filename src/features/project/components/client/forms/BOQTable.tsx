"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { BOQItem, Unit } from "@/features/project/types/project";
import { Edit, Trash2, CircleCheckBig, CircleX } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BOQTableProps {
  items: BOQItem[];
  units: Unit[];
  onAddItem: () => void;
  onEditItem: (item: BOQItem) => void;
  onDeleteItem: (itemId: string) => void;
  totalAmount: number;
}

const BOQTable: React.FC<BOQTableProps> = ({
  items,
  units,
  onAddItem,
  onEditItem,
  onDeleteItem,
  totalAmount,
}) => {
  const t = useTranslations("project.step4.boqTable");

  const getUnitName = (unitId: number) => {
    const unit = units.find((u: Unit) => u.id === unitId);
    return unit ? `${unit.name} (${unit.symbol})` : "Unknown Unit";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "SAR",
    }).format(amount);
  };

  const handleDelete = (itemId: string) => {
    onDeleteItem(itemId);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px] max-w-[200px]">
                    {t("columns.name")}
                  </TableHead>
                  <TableHead className="min-w-[250px] max-w-[300px]">
                    {t("columns.description")}
                  </TableHead>
                  <TableHead className="min-w-[100px] max-w-[150px]">
                    {t("columns.unit")}
                  </TableHead>
                  <TableHead className="min-w-[100px] max-w-[120px] text-right">
                    {t("columns.quantity")}
                  </TableHead>
                  <TableHead className="min-w-[120px] max-w-[140px] text-right">
                    {t("columns.unitPrice")}
                  </TableHead>
                  <TableHead className="min-w-[120px] max-w-[140px] text-right">
                    {t("columns.totalPrice")}
                  </TableHead>
                  <TableHead className="min-w-[100px] max-w-[120px] text-center">
                    {t("columns.required")}
                  </TableHead>
                  <TableHead className="min-w-[120px] max-w-[140px] text-center">
                    {t("columns.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium max-w-[200px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate">{item.name}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{item.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[300px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate">{item.description}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{item.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-sm max-w-[150px]">
                        <div className="truncate">
                          {getUnitName(item.unit_id)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right max-w-[120px]">
                        <div className="truncate">
                          {item.quantity.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right max-w-[140px]">
                        <div className="truncate">
                          {formatCurrency(item.unit_price)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium max-w-[140px]">
                        <div className="truncate">
                          {formatCurrency(item.quantity * item.unit_price)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center max-w-[120px]">
                        {item.is_required ? (
                          <CircleCheckBig className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <CircleX className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center max-w-[140px]">
                        <div className="flex items-center justify-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditItem(item)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-design-main text-white">
                              <p className="max-w-xs">
                                {t("dialogs.editTooltip")}
                              </p>
                            </TooltipContent>
                          </Tooltip>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>

                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {t("dialogs.deleteTitle")}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("dialogs.deleteDescription")}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {t("dialogs.cancel")}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id!)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {t("dialogs.delete")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      {t("noItems")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-muted px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">
              {t("totalAmount")}: {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BOQTable;
