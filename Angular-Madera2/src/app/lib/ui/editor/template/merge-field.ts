import Quill from 'quill';

export const MERGE_FIELD_BLOT_NAME = 'mergeField';
export const MERGE_FIELD_DATA_KEY = `data-${MERGE_FIELD_BLOT_NAME}`;

const EmbedBlot = Quill.import('blots/embed');

export class MergeFieldBlot extends EmbedBlot {
    public static create(value) {
        const newContent = `{{ ${value} }}`;
        const node = super.create(newContent);
        node.innerHTML = newContent;
        node.setAttribute(MERGE_FIELD_DATA_KEY, value);

        return node;
    }

    public static value(domNode) {
        return domNode.getAttribute(MERGE_FIELD_DATA_KEY);
    }
}

MergeFieldBlot.blotName = MERGE_FIELD_BLOT_NAME;
MergeFieldBlot.tagName = 'span';
MergeFieldBlot.className = MERGE_FIELD_BLOT_NAME;
