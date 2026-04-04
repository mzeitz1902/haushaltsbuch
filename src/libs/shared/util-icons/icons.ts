import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  CircleMinus,
  CirclePlus,
  EllipsisVertical,
  Eye,
  EyeClosed,
  HandCoins,
  Info,
  LogOut,
  Pill,
  ReceiptEuro,
  Save,
  Scale,
  Trash,
} from 'lucide-angular';

export const icons = {
  HandCoins,
  Calendar,
  ReceiptEuro,
  Eye,
  EyeClosed,
  EllipsisVertical,
  CirclePlus,
  CircleMinus,
  Trash,
  LogOut,
  ChevronDown,
  ChevronUp,
  BanknoteArrowUp,
  BanknoteArrowDown,
  Scale,
  Info,
  Pill,
  Save
};

export type Icon = keyof typeof icons;
