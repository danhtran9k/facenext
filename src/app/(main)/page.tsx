import { CreatePostEditor } from "@module/create-post";

export default function Home() {
  return (
    <main className="h-[200vh] w-full bg-red-50">
      <div className="w-full">
        <CreatePostEditor />
      </div>
    </main>
  );
}
