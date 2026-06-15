import {
  Home,
  PlusCircle,
  Compass,
  Languages,
  MessageCircle,
  Shield,
  FileText,
  Bot,
  Clock3,
  Settings,
  Users,
  Pill,
  AlertTriangle,
  FolderOpen,
  Headphones,
  Activity,
  Share2,
  List,
  Stethoscope,
  BadgeCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/stores/onboarding-store";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  accent?: boolean;
  live?: boolean;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

const PATIENT_NAV: NavSection[] = [
  {
    title: "Navigation",
    items: [
      { href: "/app", label: "Home", icon: Home },
      { href: "/app/session/new", label: "New session", icon: PlusCircle, accent: true },
      { href: "/app/session/active", label: "Active", icon: Compass, live: true },
    ],
  },
  {
    title: "Operating System",
    items: [
      { href: "/app/passport", label: "Passport", icon: Shield },
      { href: "/app/passport/shares", label: "Shared", icon: Share2 },
      { href: "/app/vault", label: "Vault", icon: FileText },
      { href: "/app/interpreter", label: "Interpreter", icon: Languages },
      { href: "/app/interpreter/live", label: "Live Interpreter", icon: Headphones, live: true },
      { href: "/app/conversations", label: "Conversations", icon: MessageCircle },
      { href: "/app/agent", label: "Agent", icon: Bot },
    ],
  },
  {
    title: "Secondary",
    items: [
      { href: "/app/activity", label: "Activity", icon: List },
      { href: "/app/history", label: "History", icon: Clock3 },
      { href: "/app/graph", label: "Health Graph", icon: Activity },
      { href: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

const MEDICAL_ASSISTANT_NAV: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { href: "/app", label: "Dashboard", icon: Home },
      { href: "/app/provider/assistant", label: "Assistant Workspace", icon: Stethoscope },
      { href: "/app/shared", label: "Shared Records", icon: FolderOpen },
    ],
  },
  {
    title: "Tasks",
    items: [
      { href: "/app/assigned", label: "Assigned Travelers", icon: Users },
      { href: "/app/conversations", label: "Active Conversations", icon: MessageCircle, live: true },
      { href: "/app/interpreter", label: "Translation Queue", icon: Languages },
      { href: "/app/passport/reviews", label: "Passport Reviews", icon: Shield },
      { href: "/app/escalations", label: "Escalations", icon: AlertTriangle },
    ],
  },
  {
    title: "Tools",
    items: [
      { href: "/app/provider/agent", label: "Provider Agent", icon: Bot },
      { href: "/app/provider/activity", label: "Activity Feed", icon: Activity },
      { href: "/app/provider/verification", label: "Verification", icon: BadgeCheck },
    ],
  },
  {
    title: "Record",
    items: [
      { href: "/app/history", label: "History", icon: Clock3 },
      { href: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

const PHARMACIST_NAV: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { href: "/app", label: "Dashboard", icon: Home },
      { href: "/app/provider/pharmacist", label: "Pharmacist Workspace", icon: Pill },
      { href: "/app/shared", label: "Shared Records", icon: FolderOpen },
    ],
  },
  {
    title: "Records",
    items: [
      { href: "/app/passport/shared", label: "Shared Passports", icon: Shield },
      { href: "/app/medications", label: "Medication Lookup", icon: Pill },
      { href: "/app/medication-intelligence", label: "Medication Intelligence", icon: Bot },
    ],
  },
  {
    title: "Tools",
    items: [
      { href: "/app/conversations", label: "Conversations", icon: MessageCircle, live: true },
      { href: "/app/interpreter", label: "Translation Requests", icon: Languages },
      { href: "/app/provider/agent", label: "Provider Agent", icon: Bot },
      { href: "/app/provider/activity", label: "Activity Feed", icon: Activity },
      { href: "/app/provider/verification", label: "Verification", icon: BadgeCheck },
    ],
  },
  {
    title: "Record",
    items: [
      { href: "/app/history", label: "History", icon: Clock3 },
      { href: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

const DOCTOR_NAV: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { href: "/app", label: "Dashboard", icon: Home },
      { href: "/app/provider/doctor", label: "Doctor Workspace", icon: Stethoscope },
      { href: "/app/shared", label: "Shared Records", icon: FolderOpen },
    ],
  },
  {
    title: "Collaboration",
    items: [
      { href: "/app/conversations", label: "Patient Conversations", icon: MessageCircle, live: true },
      { href: "/app/passport/shared", label: "Shared Passports", icon: Shield },
      { href: "/app/interpreter", label: "Interpreter Requests", icon: Headphones },
    ],
  },
  {
    title: "Tools",
    items: [
      { href: "/app/provider/agent", label: "Provider Agent", icon: Bot },
      { href: "/app/provider/activity", label: "Activity Feed", icon: Activity },
      { href: "/app/provider/verification", label: "Verification", icon: BadgeCheck },
      { href: "/app/session/new", label: "New Session", icon: PlusCircle },
    ],
  },
  {
    title: "Record",
    items: [
      { href: "/app/history", label: "History", icon: Clock3 },
      { href: "/app/graph", label: "Health Graph", icon: Activity },
      { href: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function getNavForRole(role: UserRole | null | undefined): NavSection[] {
  switch (role) {
    case "MEDICAL_ASSISTANT":
    case "CLINIC_STAFF":
    case "HOSPITAL_STAFF":
      return MEDICAL_ASSISTANT_NAV;
    case "PHARMACIST":
      return PHARMACIST_NAV;
    case "DOCTOR":
      return DOCTOR_NAV;
    case "PATIENT":
    default:
      return PATIENT_NAV;
  }
}
