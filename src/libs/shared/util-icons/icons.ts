import {
  BadgeMinus,
  BadgePlus,
  Calendar,
  ChevronDown,
  ChevronUp,
  CirclePlus,
  EllipsisVertical,
  Eye,
  EyeClosed,
  HandCoins,
  LogOut,
  ReceiptEuro,
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
  Trash,
  LogOut,
  ChevronDown,
  ChevronUp,
  BadgePlus,
  BadgeMinus,
};

export type Icon = keyof typeof icons;
