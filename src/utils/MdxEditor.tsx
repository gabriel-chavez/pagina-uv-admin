import '@mdxeditor/editor/style.css';
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  ListsToggle,
  listsPlugin,
  tablePlugin,
  InsertTable,
  InsertThematicBreak,
  thematicBreakPlugin,
  Separator
} from '@mdxeditor/editor';

function Editor({ value, onChange }) {
  return (
    <MDXEditor
      markdown={value}
      onChange={onChange}
      plugins={[
        listsPlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <InsertTable />
              <InsertThematicBreak />
            </>
          )
        })
      ]}
    />
  );
}

export default Editor;
