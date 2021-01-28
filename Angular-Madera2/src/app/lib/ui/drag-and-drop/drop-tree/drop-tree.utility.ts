import { DropTreeInfoModel } from './drop-tree.directive';
import { FormArray, AbstractControl } from '@angular/forms';
import { uniq } from 'lodash';

type UpdateOrderFn<Item> = (
    item: Item | AbstractControl,
    order: number
) => void;

type UpdateIndentFn<Item> = (
    item: Item | AbstractControl,
    indentDiff: number
) => void;

export function moveDroppedInList<Item>(
    destList: Item[] | FormArray,
    dropInfo: DropTreeInfoModel,
    updateOrderFn?: UpdateOrderFn<Item>,
    updateIndentFn?: UpdateIndentFn<Item>,
    srcList?: Item[] | FormArray
): void {
    srcList = srcList || destList;

    const srcItems: Array<Item | AbstractControl> =
        srcList instanceof FormArray ? srcList.controls : srcList;
    const destItems: Array<Item | AbstractControl> =
        destList instanceof FormArray ? destList.controls : destList;

    const movedList = srcItems.splice(dropInfo.previousIndex, dropInfo.count);

    if (updateIndentFn) {
        const indentDiff = dropInfo.nextIndent - dropInfo.previousIndent;
        movedList.forEach((i) => updateIndentFn(i, indentDiff));
    }

    destItems.splice(dropInfo.nextIndex, 0, ...movedList);

    if (updateOrderFn) {
        uniq([srcItems, destItems]).forEach((items) =>
            items.forEach((item, index) => updateOrderFn(item, index))
        );
    }
}
