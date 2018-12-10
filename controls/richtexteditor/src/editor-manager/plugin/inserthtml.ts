import { NodeSelection } from './../../selection/index';

import { NodeCutter } from './nodecutter';
import * as CONSTANT from './../base/constant';

import { InsertMethods } from './insert-methods';

/**
 * Insert a HTML Node or Text
 * @hidden
 */
export class InsertHtml {

    public static Insert(docElement: Document, insertNode: Node | string, editNode?: Element): void {
        let node: Node;
        if (typeof insertNode === 'string') {
            let divNode: HTMLElement = document.createElement('div');
            divNode.innerHTML = insertNode;
            node = divNode.firstChild;
        } else {
            node = insertNode;
        }
        let nodeSelection: NodeSelection = new NodeSelection();
        let nodeCutter: NodeCutter = new NodeCutter();
        let range: Range = nodeSelection.getRange(docElement);
        let isCollapsed: boolean = range.collapsed;
        let nodes: Node[] = nodeSelection.getInsertNodeCollection(range);
        let closestParentNode: Node = (node.nodeName.toLowerCase() === 'table') ? this.closestEle(nodes[0].parentNode, editNode) : nodes[0];
        if ((!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
            CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) !== -1))
            || (node.nodeName.toLowerCase() === 'table' && closestParentNode &&
                CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) === -1)) {
            let preNode: Node = nodeCutter.GetSpliceNode(range, closestParentNode as HTMLElement);
            let sibNode: Node = preNode.previousSibling;
            let parentNode: Node = preNode.parentNode;
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            } else {
                let lasNode: Node = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1] as HTMLElement);
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            range.extractContents();
            for (let index: number = 0; index < nodes.length; index++) {
                if (nodes[index].nodeType !== 3 && nodes[index].parentNode != null) {
                    nodes[index].parentNode.removeChild(nodes[index]);
                }
            }
            if (sibNode) {
                InsertMethods.AppendBefore(node as HTMLElement, sibNode as HTMLElement, true);
            } else {
                if (parentNode.firstChild) {
                    InsertMethods.AppendBefore(node as HTMLElement, parentNode.firstChild as HTMLElement, false);
                } else {
                    parentNode.appendChild(node);
                }
            }
            if (node.nodeType !== 3) {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.childNodes.length);
            } else {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.textContent.length);
            }
        } else {
            range.deleteContents();
            range.insertNode(node);
            if (node.nodeType !== 3 && node.childNodes.length > 0) {
                nodeSelection.setSelectionText(docElement, node, node, 1, 1);
            } else if (node.nodeType !== 3) {
                nodeSelection.setSelectionContents(docElement, node);
            } else {
                nodeSelection.setSelectionText(docElement, node, node, node.textContent.length, node.textContent.length);
            }
        }
    }

    private static closestEle(element: Element | Node, editNode: Element): Element {
        let el: Element = <Element>element;
        while (el && el.nodeType === 1) {
            if (el.parentNode === editNode ||
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((el.parentNode as Element).tagName.toLocaleLowerCase()) !== -1) {
                return el;
            }
            el = <Element>el.parentNode;
        }
        return null;
    }
}