import Editor from "@/components/editor/Editor";

export const metadata = {
  title: "Editor",
};

export default function EditorPage() {
  return (
    <main>
      <div className="pt-16">
        <Editor />
      </div>
    </main>
  );
}
