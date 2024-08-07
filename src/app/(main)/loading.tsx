import { Loader2 } from "lucide-react";

export default function Loading() {
  console.count("🚀🚀 loading L4 render");
  return <Loader2 className="mx-auto my-3 animate-spin" />;
}
