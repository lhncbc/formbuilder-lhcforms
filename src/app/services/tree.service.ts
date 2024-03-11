import {Injectable} from '@angular/core';
import {ITreeModel} from '@bugsplat/angular-tree-component/lib/defs/api';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  treeModel: ITreeModel;

  _nodeFocus = new Subject<any>();

  _nodeMove = new Subject<any>();

  constructor() {
  }

  get nodeFocus(): Subject<any> {
    return this._nodeFocus;
  }

  get nodeMove(): Subject<any> {
    return this._nodeMove;
  }
}
