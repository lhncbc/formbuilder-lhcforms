import {Injectable} from '@angular/core';
import {ITreeModel} from '@bugsplat/angular-tree-component/lib/defs/api';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  treeModel: ITreeModel;

  _nodeFocus = new Subject<any>();

  _nodeDrop = new Subject<any>();

  constructor() {
  }

  get nodeFocus(): Subject<any> {
    return this._nodeFocus;
  }

  get nodeDrop(): Subject<any> {
    return this._nodeDrop;
  }
}
